import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { logInWithAuth } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

type LoginWithGoogleProps = {
  text?: "signin_with" | "signup_with" | "continue_with";
};

export default function LoginWithGoogle({ text }: LoginWithGoogleProps) {
  const { getUser } = useAuth();
  // const login = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     console.log("Google token response:", tokenResponse);

  //     // try {
  //     //   const res = await logInWithGoogleApi(tokenResponse.access_token);
  //     //   console.log(res);
  //     // } catch (err) {
  //     //   console.error(err);
  //     // }
  //   },
  //   prompt: "consent",
  // });
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await logInWithAuth({
        provider: "google",
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.token ?? "");
      await getUser();
    } catch (err: any) {
      console.error("Google login failed", err.response?.data || err.message);
    }
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <GoogleLogin
      text={text}
      theme="filled_black"
      shape="rectangular"
      logo_alignment="left"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
