import { baseApi } from "./BaseApi";

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "students",
      providesTags: ["Student"],
    }),

    getStudentById: builder.query({
      query: (id) => `students/${id}`,
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),

    createStudent: builder.mutation({
      query: (student) => ({
        url: "students",
        method: "POST",
        body: student,
      }),

      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
} = studentsApi;
