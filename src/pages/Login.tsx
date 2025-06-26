import { NavLink } from "react-router-dom";

import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "../contexts/AuthContext";
import { logInWithAuth } from "../services/api";
import LoginWithGoogle from "../components/LoginWithGoogle";
import GitHubLoginButton from "../components/GitHubLoginButton";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const { getUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      console.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const data = await logInWithAuth({
        provider: "local",
        email: email.toString(),
        password: password.toString(),
      });
      localStorage.setItem("token", data.token ?? "");
      await getUser();
    } catch (error) {
      localStorage.removeItem("token");
      console.error("Login or user fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" px-4 mx-auto w-full justify-center items-center h-full flex flex-col">
      <div className="max-w-xl w-full mx-auto px-8 py-10 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold text-center">Welcome Back </h1>
        <form onSubmit={handleLogin} className="mt-10">
          <div className="mt-4">
            <label className="text-lg font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full mt-1 px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none "
            />
          </div>
          <div className="mt-4">
            <label className="text-lg font-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full mt-1 px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-10 disabled:bg-rose-100 disabled:text-black bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition duration-200"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="flex items-center justify-between my-4">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="w-full border-gray-300" />
        </div>

        <div className="flex items-center gap-x-4">
          <div className="w-full">
            <LoginWithGoogle text="signin_with" />
          </div>
          <div className="w-full">
            <GitHubLoginButton text={"signin_with"} />
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-blue-600 hover:underline">
              Register
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
