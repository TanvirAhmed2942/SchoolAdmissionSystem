import { baseApi } from "./BaseApi";

export type AdmissionHold = {
  id: string;
  classId: string;
  className: string;
  studentId: string;
  status: HoldStatus;
  createdAt: string;
  modifiedAt: string;
  expiresAt: string;
  confirmedAt: string | null;
};

export const AdmissionStatusCode = {
  HELD: 1,
  CONFIRMED: 2,
  EXPIRED: 3,
  CANCELLED: 4,
} as const;
export type HoldStatus = keyof typeof AdmissionStatusCode;

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createHold: builder.mutation<
      AdmissionHold,
      { classId: string; studentId: string }
    >({
      query: ({ classId, studentId }) => ({
        url: `/candidate/classes/${classId}/holds`,
        method: "POST",
        headers: { "X-Student-Id": studentId },
      }),
      invalidatesTags: ["Admin"],
    }),

    // GUESSED routes: check them in Swagger and adjust
    confirmHold: builder.mutation<
      AdmissionHold,
      { holdId: string; studentId: string }
    >({
      query: ({ holdId, studentId }) => ({
        url: `/candidate/classes/holds/${holdId}`,
        method: "POST",
        params: { status: AdmissionStatusCode.CONFIRMED },
        headers: { "X-Student-Id": studentId },
      }),
      invalidatesTags: ["Admin"],
    }),

    cancelHold: builder.mutation<
      AdmissionHold,
      { holdId: string; studentId: string }
    >({
      query: ({ holdId, studentId }) => ({
        url: `/candidate/classes/holds/${holdId}`,
        method: "POST",
        params: { status: AdmissionStatusCode.CANCELLED },
        headers: { "X-Student-Id": studentId },
      }),
      invalidatesTags: ["Admin"],
    }),

    getMyApplications: builder.query<AdmissionHold[], string>({
      query: (studentId) => ({
        url: "/me/holds",
        headers: { "X-Student-Id": studentId },
      }),
      providesTags: ["Hold", "Admin"],
    }),
  }),
});

export const {
  useCreateHoldMutation,
  useConfirmHoldMutation,
  useCancelHoldMutation,
  useGetMyApplicationsQuery,
} = studentApi;
