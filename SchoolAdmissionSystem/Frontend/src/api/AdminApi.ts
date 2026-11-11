import { baseApi } from "./BaseApi";

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
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
} = adminApi;
