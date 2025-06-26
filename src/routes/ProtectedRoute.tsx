import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading: userLoading } = useAuth();

  if (userLoading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
