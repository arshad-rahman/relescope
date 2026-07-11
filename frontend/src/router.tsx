import {
  Navigate,
  createBrowserRouter,
} from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import GitHubConnect from "./pages/GitHubConnect";
import Home from "./pages/Home";
import LiteDashboard from "./pages/LiteDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/connect",
    element: <GitHubConnect />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/lite",
        element: <LiteDashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <Navigate
        to="/"
        replace
      />
    ),
  },
]);
