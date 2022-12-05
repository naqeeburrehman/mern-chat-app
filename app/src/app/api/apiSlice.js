import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://192.168.1.168:1000/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

let reqSentStatus = false;

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions);

    // If you want, handle other status codes, too
    if (result?.error?.status === 403 || (result?.error?.originalStatus === 403 && reqSentStatus === false)) {
        console.log("sending refresh token");
        reqSentStatus = true;

        // send refresh token to get new access token
        const refreshResult = await baseQuery("/refresh", api, extraOptions);

        if (refreshResult?.data) {
            // store the new token
            api.dispatch(setCredentials({ ...refreshResult.data }));

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions);
            reqSentStatus = false;
        } else {
            if (
                refreshResult?.error?.status === 403 ||
                (refreshResult?.error?.originalStatus === 403 && reqSentStatus === false)
            ) {
                refreshResult.error.data.message = "Your login has expired.";
            }
            reqSentStatus = false;
            return refreshResult;
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Projects", "Listings"],
    endpoints: (builder) => ({}),
});
