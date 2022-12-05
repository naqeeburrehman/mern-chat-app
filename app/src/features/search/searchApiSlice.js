import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const searchsAdapter = createEntityAdapter({});

const initialState = searchsAdapter.getInitialState();

export const searchsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSearchs: builder.query({
            query: ({ q, u }) => ({
                url: `/search?q=${q}&u=${u}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData) => {
                const loadedSearchs = responseData.map((search) => {
                    search.id = search._id;
                    return search;
                });
                return searchsAdapter.setAll(initialState, loadedSearchs);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [{ type: "Search", id: "LIST" }, ...result.ids.map((id) => ({ type: "Search", id }))];
                } else return [{ type: "Search", id: "LIST" }];
            },
        }),
        searchPost: builder.mutation({
            query(data) {
                return {
                    url: "search?u=321",
                    method: "POST",
                    credentials: "include",
                    body: data,
                };
            },
            invalidatesTags: (result, error, arg) => [{ type: "Search", id: arg.id }],
        }),
    }),
});

export const { useGetSearchsQuery, useSearchPostMutation } = searchsApiSlice;

// returns the query result object
export const selectSearchsResult = searchsApiSlice.endpoints.getSearchs.select();

// creates memoized selector
const selectSearchsData = createSelector(
    selectSearchsResult,
    (searchsResult) => searchsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllSearchs,
    selectById: selectSearchById,
    selectIds: selectSearchIds,
    // Pass in a selector that returns the searchs slice of state
} = searchsAdapter.getSelectors((state) => selectSearchsData(state) ?? initialState);
