import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.PUBLIC_API_BASE_URL,
  }),

  tagTypes: ["Student", "Admin"],

  endpoints: () => ({}),
});
