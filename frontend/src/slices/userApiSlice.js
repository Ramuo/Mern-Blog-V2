import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login : builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data
            }),
        }),
        google: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/google`,
                method: 'POST',
                body: data
            }),
            
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            }),
        }),
        updateUserprofile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data
            }),
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),
        getUsers: builder.query({
            query: () => ({
              url: USERS_URL,
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5,
          }),
        // updateUser: builder.mutation({
        //     query: (data) => ({
        //         url: `${USERS_URL}/${data.userId}`,
        //         method: 'PUT',
        //         body: data
        //     }),
        //     invalidatesTags: ['Users']//To clear the cache
        // }),
    }),
});


export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGoogleMutation,
    useUpdateUserprofileMutation,
    useDeleteUserMutation,
    useGetUsersQuery,
    // useUpdateUserMutation,
} = userApiSlice