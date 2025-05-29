import { apiSlice } from "./apiSlice";
import type { Snippet } from "@/app/snippets/SnippetsList";

export const snippetsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSnippets: builder.query<Snippet[], void>({
      query: () => "/snippets/",
      providesTags: ["Snippets"],
    }),
    createSnippet: builder.mutation<Snippet, Partial<Snippet>>({
      query: (snippet) => ({
        url: "/snippets/",
        method: "POST",
        body: snippet,
      }),
      invalidatesTags: ["Snippets"],
    }),
    updateSnippet: builder.mutation<Snippet, Partial<Snippet> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/snippets/${id}/`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Snippets"],
    }),
    deleteSnippet: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/snippets/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Snippets"],
    }),
  }),
});

export const { useGetSnippetsQuery, useCreateSnippetMutation, useUpdateSnippetMutation, useDeleteSnippetMutation } = snippetsApiSlice;
