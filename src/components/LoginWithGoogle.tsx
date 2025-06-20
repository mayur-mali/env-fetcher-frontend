import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { logInWithGoogleApi } from "../services/api";
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
      const res = await logInWithGoogleApi(credentialResponse.credential);
      localStorage.setItem("token", res.token ?? "");
      await getUser();
    } catch (err) {
      console.error("Google login failed", err.response?.data || err.message);
    }
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <GoogleLogin
      text={text}
      width={"100%"}
      theme="filled_black"
      shape="rectangular"
      logo_alignment="left"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
