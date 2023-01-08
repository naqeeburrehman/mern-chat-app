import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../../features/auth/authSlice";
import { Mutex } from "async-mutex";

// create a new mutex
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    // baseUrl: "http://localhost:1000/",
    // baseUrl: "http://192.168.1.168:1000/",
    baseUrl: "http://192.168.100.124:1000/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);

    // If you want, handle other status codes, too
    if (result?.error?.status === 403 || result?.error?.originalStatus === 403) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                // send refresh token to get new access token
                console.log("sending refresh token");
                const refreshResult = await baseQuery("/refresh", api, extraOptions);

                if (refreshResult?.data) {
                    // store the new token
                    api.dispatch(setCredentials({ ...refreshResult.data }));

                    // retry original query with new access token
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    if (refreshResult?.error?.status === 401 || refreshResult?.error?.originalStatus === 401) {
                        api.dispatch(setCredentials({ token: null }));
                        console.log("yeah now redirect");
                        window.location.pathname = "/login";
                        refreshResult.error.data.message = "Your login has expired.";
                    }
                    return refreshResult;
                }
            } finally {
                // release must be called once the mutex should be released again.
                release();
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Chats", "Searchs"],
    endpoints: (builder) => ({}),
});
