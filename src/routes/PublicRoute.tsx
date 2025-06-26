import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useAuth();

  if (userLoading) return <Loading />;
  if (user) return <Navigate to="/" />;
  return children;
}

export default PublicRoute;
