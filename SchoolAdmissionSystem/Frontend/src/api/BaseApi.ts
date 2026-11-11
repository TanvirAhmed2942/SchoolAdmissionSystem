import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.PUBLIC_API_BASE_URL;

if (!baseUrl) {
  console.error(
    "PUBLIC_API_BASE_URL is not set. Check your .env file and restart the dev server.",
  );
}

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl ?? "http://localhost:8080/api",
  }),

  tagTypes: ["Student", "Admin", "Class", "Hold"],

  endpoints: () => ({}),
});
