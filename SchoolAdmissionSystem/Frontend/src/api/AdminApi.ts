import { baseApi } from "./BaseApi";
const API_ORIGIN = String("http://localhost:8080")
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");
export type SchoolClass = {
  id: string;
  name: string;
  totalSeats: number;
  availableSeats: number;
  heldSeats: number;
  confirmedSeats: number;
};

export type CreateClassRequest = {
  name: string; // "Class Five - Morning"
  totalSeats: number;
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<SchoolClass[], void>({
      query: () => "admin/classes",
      providesTags: ["Admin"],
    }),

    // A GET should be a query, not a mutation
    getClassById: builder.query<SchoolClass, string>({
      query: (id) => `admin/classes/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Admin", id }],
    }),

    createClass: builder.mutation<SchoolClass, CreateClassRequest>({
      query: (body) => ({
        url: "admin/classes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"], // refetches getClasses
    }),

    deleteClass: builder.mutation<void, string>({
      query: (id) => ({ url: `admin/classes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Admin"],
    }),
    deleteAllData: builder.mutation<string, void>({
      query: () => ({
        url: `${API_ORIGIN}/dev/clear-database`,
        method: "POST",
        responseHandler: "text",
      }),
      invalidatesTags: ["Admin", "Hold"],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useDeleteClassMutation,
  useDeleteAllDataMutation,
} = adminApi;
