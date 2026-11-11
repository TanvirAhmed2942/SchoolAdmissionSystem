import { baseApi } from "./BaseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => "admin/classes",
      providesTags: ["Admin"],
    }),

    getClassById: builder.query({
      query: (id) => `admin/classes/${id}`,
      providesTags: (result, error, id) => [{ type: "Admin", id }],
    }),
  }),
});

export const { useGetClassesQuery, useGetClassByIdQuery } = adminApi;
