import { apiSlice } from "./apiSlice";
import { POSTS_URL} from "../constants";



const postApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPost: builder.mutation({
            query: (data) => ({
                url: `${POSTS_URL}/createpost`,
                method: 'POST',
                body: data
            }),
        }),
        getPosts: builder.query({
            query: () => ({
                url: `${POSTS_URL}/getposts`
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Posts']
        }),
        deletePost: builder.mutation({
            query: (postId, userId) => ({
                url: `${POSTS_URL}/${postId}/${userId}`,
                method: 'DELETE'
            }),
        }),
    })
});

export const {
    useCreatePostMutation,
    useGetPostsQuery,
    useDeletePostMutation,
} = postApiSlice