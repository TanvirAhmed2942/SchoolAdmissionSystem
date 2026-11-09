import Layout from "@/layout/Layout";
import App from "@/pages/App";
import MyApplications from "@/pages/MyApplications";
import Reservation from "@/pages/Reservation";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/create-reservation/:id",
        element: <Reservation />,
      },
      {
        path: "/my-applications",
        element: <MyApplications />,
      },
      {
        path: "/admin",
        element: <div>Admin</div>,
      },
    ],
  },
]);

export default router;
