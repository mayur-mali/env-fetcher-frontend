// src/pages/auth/github/callback.jsx
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { githubCallBackApi, logInWithGithubApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const GithubCallback = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  useEffect(() => {
    const handleGithubRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        alert("GitHub login failed. No code found.");
        return;
      }

      try {
        // 1. Exchange code for access token
        const tokenRes = await githubCallBackApi(code);

        const res = await logInWithGithubApi({
          token: tokenRes.token,
          provider: "github",
        });

        console.log("GitHub login successful:", res);

        // localStorage.setItem("token", res.token ?? "");
        // await getUser();
      } catch (err) {
        console.error(err);
        // alert("GitHub login failed.");
        // navigate("/login");
      }
    };

    handleGithubRedirect();
  }, [navigate]);

  return <p>Logging in with GitHub...</p>;
};

export default GithubCallback;
