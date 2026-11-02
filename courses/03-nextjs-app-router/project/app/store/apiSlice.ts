import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface ApiPost {
  id: number
  title: string
  body: string
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getPosts: builder.query<ApiPost[], void>({
      query: () => 'api/posts',
    }),
  }),
})

export const { useGetPostsQuery } = postsApi
