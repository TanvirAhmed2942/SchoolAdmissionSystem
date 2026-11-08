import Layout from "@/layout/Layout";
import App from "@/pages/App";
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
        path: "/my-applications",
        element: <div>My Applications</div>,
      },
      {
        path: "/admin",
        element: <div>Admin</div>,
      },
    ],
  },
]);

export default router;
