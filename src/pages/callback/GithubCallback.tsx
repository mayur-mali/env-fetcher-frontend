// src/pages/auth/github/callback.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { githubCallBackApi, logInWithAuth } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/loading";

const GithubCallback = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleGithubRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        alert("GitHub login failed. No code found.");
        return;
      }

      try {
        setLoading(true);
        const tokenRes = await githubCallBackApi(code);

        const res = await logInWithAuth({
          token: tokenRes.token,
          provider: "github",
        });

        if (!res || !res.token) {
          throw new Error("Login failed, no token received");
        } else {
          localStorage.setItem("token", res.token ?? "");
          window.location.href = "/";
        }
      } catch (err) {
        setLoading(false);
        console.log("GitHub login error:", err);
      } finally {
        setLoading(false);
      }
    };

    handleGithubRedirect();
  }, [navigate]);
  if (loading) return <Loading />;
  return <p>Logging in with GitHub...</p>;
};

export default GithubCallback;
