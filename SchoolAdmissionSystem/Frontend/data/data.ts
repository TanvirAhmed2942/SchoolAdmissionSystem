export type ClassSeat = {
  id: number;
  name: string;
  totalSeats: number;
  available: number;
  held: number;
  confirmed: number;
};

export const classes: ClassSeat[] = [
  {
    id: 1,
    name: "Class One",
    totalSeats: 40,
    available: 12,
    held: 3,
    confirmed: 25,
  },
  {
    id: 2,
    name: "Class Two",
    totalSeats: 40,
    available: 6,
    held: 2,
    confirmed: 32,
  },
  {
    id: 3,
    name: "Class Three",
    totalSeats: 35,
    available: 0,
    held: 0,
    confirmed: 35,
  },
  {
    id: 4,
    name: "Class Four",
    totalSeats: 35,
    available: 9,
    held: 4,
    confirmed: 22,
  },
];
export type ApplicationStatus = "held" | "confirmed" | "cancelled" | "expired";

export type Application = {
  id: string;
  className: string;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string
  status: ApplicationStatus;
};

// Mock data, replace with your API
export const applications: Application[] = [
  {
    id: "APP-2025-8798",
    className: "Class Two",
    createdAt: "2026-11-09T14:59:00+06:00",
    expiresAt: "2026-11-09T15:09:00+06:00",
    status: "confirmed",
  },
  {
    id: "APP-2025-1322",
    className: "Class One",
    createdAt: "2026-11-09T14:47:00+06:00",
    expiresAt: "2026-11-09T14:57:00+06:00",
    status: "expired",
  },
  {
    id: "APP-2025-9367",
    className: "Class One",
    createdAt: "2026-11-09T14:19:00+06:00",
    expiresAt: "2026-11-09T14:29:00+06:00",
    status: "expired",
  },
  {
    id: "APP-2025-5573",
    className: "Class One",
    createdAt: "2026-11-09T14:17:00+06:00",
    expiresAt: "2026-11-09T14:27:00+06:00",
    status: "cancelled",
  },
  {
    id: "APP-2025-1229",
    className: "Class One",
    createdAt: "2026-11-09T13:54:00+06:00",
    expiresAt: "2026-11-09T14:04:00+06:00",
    status: "expired",
  },
  {
    id: "APP-2025-9306",
    className: "Class Two",
    createdAt: "2026-11-09T13:50:00+06:00",
    expiresAt: "2026-11-09T14:00:00+06:00",
    status: "cancelled",
  },
  {
    id: "APP-2025-9769",
    className: "Class One",
    createdAt: "2026-11-09T13:50:00+06:00",
    expiresAt: "2026-11-09T14:00:00+06:00",
    status: "expired",
  },
  {
    id: "APP-2025-0182",
    className: "Class Three",
    createdAt: "2026-11-05T02:46:00+06:00",
    expiresAt: "2026-11-05T02:56:00+06:00",
    status: "confirmed",
  },
  {
    id: "APP-2025-0137",
    className: "Class Two",
    createdAt: "2026-11-01T02:46:00+06:00",
    expiresAt: "2026-11-01T02:56:00+06:00",
    status: "expired",
  },
];
