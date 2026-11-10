import Layout from "@/layout/Layout";
import Admin from "@/pages/Admin";
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
        element: <Admin />,
      },
    ],
  },
]);

export default router;
