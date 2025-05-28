import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import AuthRedirect from "./AuthRedirect";
import Signup from "../pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/about", element: <>About</> },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthRedirect>
        <Login />
      </AuthRedirect>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthRedirect>
        <Signup />
      </AuthRedirect>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
