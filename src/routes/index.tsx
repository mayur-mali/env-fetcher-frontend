import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import AuthRedirect from "./AuthRedirect";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Project from "../pages/Project";
import Developers from "../pages/Developers";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Groups from "../pages/Groups";
import GithubCallback from "../pages/callback/GithubCallback";
import TokenGenerate from "../pages/TokenGenerate";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/project", element: <Project /> },
      { path: "/developer", element: <Developers /> },
      { path: "/group", element: <Groups /> },
      { path: "/token-generate", element: <TokenGenerate /> },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <Signup />,
      },
    ],
  },
  {
    path: "/auth/github/callback",
    element: <GithubCallback />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
