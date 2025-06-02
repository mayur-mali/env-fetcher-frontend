import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  use,
} from "react";
import { getUserApi } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getUserApi()
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const getUser = () => {
    return getUserApi().then((data) => {
      setUser(data);
      return data;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, getUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
