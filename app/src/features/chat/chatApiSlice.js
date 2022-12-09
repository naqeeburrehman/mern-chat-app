import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const chatsAdapter = createEntityAdapter({});

const initialState = chatsAdapter.getInitialState();

export const chatsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query({
            query: ({ q, u }) => ({
                url: `/chat?q=${q}&u=${u}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedChats = responseData.map((chat) => {
                    chat.id = chat._id;
                    return chat;
                });
                return chatsAdapter.setAll(initialState, loadedChats);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [{ type: "Chat", id: "LIST" }, ...result.ids.map((id) => ({ type: "Chat", id }))];
                } else return [{ type: "Chat", id: "LIST" }];
            },
        }),
    }),
});

export const { useGetChatsQuery } = chatsApiSlice;

// returns the query result object
export const selectChatsResult = chatsApiSlice.endpoints.getChats.select();

// creates memoized selector
const selectChatsData = createSelector(
    selectChatsResult,
    (chatsResult) => chatsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChats,
    selectById: selectChatById,
    selectIds: selectChatIds,
    // Pass in a selector that returns the chats slice of state
} = chatsAdapter.getSelectors((state) => selectChatsData(state) ?? initialState);
