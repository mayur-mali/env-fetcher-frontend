import React, { useEffect, useRef, useState } from "react";

import { Navigate, NavLink, useNavigate } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { registerApi } from "../services/api";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: (user: any) => void;
  onBackToLogin: () => void;
}
const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationSuccess,
  onBackToLogin,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleOtpChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    // if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
    //   handleVerify(newOtp.join(""));
    // }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <IoMdArrowRoundBack className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl" />
      <h2 className="text-lg font-bold text-center">Verify Your Email</h2>
      <p className="text-center">We've sent a 6-digit verification code to</p>
      <div className="h-10 flex items-center gap-x-2 rounded-md my-6 justify-center bg-green-100 border border-green-200">
        <MdOutlineMarkEmailRead className="text-2xl text-green-500" />
        {email}
      </div>
      <div className="flex items-center justify-center mt-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            pattern="[0-9]*"
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            autoFocus={index === 0}
            className="w-12 h-12 text-center text-2xl border-2 border-gray-300 font-bold rounded-lg focus:shadow-lg focus:shadow-blue-500/20 focus:outline-none focus:border-blue-500 mx-1"
          />
        ))}
      </div>
      <div className="timer-section text-center mt-4">
        {timeLeft > 0 ? (
          <p className="timer text-gray-500">
            Code expires in{" "}
            <span className="text-black">{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <p className="timer expired">Code has expired</p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => {
            if (canResend) {
              setIsResending(true);
              // Simulate API call to resend OTP
              setTimeout(() => {
                setIsResending(false);
                setCanResend(false);
                setTimeLeft(40);
                toast.success("OTP resent successfully");
              }, 2000);
            } else {
              toast.error("Please wait before resending the OTP");
            }
          }}
          disabled={!canResend || isResending}
          className={`px-4 py-2 rounded-lg text-white ${
            canResend ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
          }`}
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

type AuthView = "signup" | "otp";

function Signup() {
  const [currentView, setCurrentView] = useState<AuthView>("signup");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const confirmPassword = formData.get("confirmPassword");
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Simulate API call to register user
      setTimeout(() => {
        setLoading(false);
        setCurrentView("otp");
        toast.success("Registration successful! Please verify your email.");
      }, 2000);

      // const res = await registerApi({
      //   firstName: firstName?.toString() || "",
      //   lastName: lastName?.toString() || "",
      //   email: email.toString(),
      //   password: password.toString(),
      // });

      // if (res === "Admin registered. Please verify OTP sent to your email.") {
      //   setLoading(false);
      // }
    } catch (error) {
      console.error("error while creating user", error.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" max-w-lg px-4 mx-auto w-full justify-center items-center h-full flex flex-col">
      {currentView === "signup" && (
        <div>
          <h1 className="text-5xl font-bold">Get Start For Free</h1>
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex w-full mt-10 gap-x-8 items-center">
              <div className="w-1/2">
                <label className="text-lg font-semibold">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  required
                  className="w-full px-4 py-1.5 mt-1 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
              <div className="w-1/2">
                <label className="text-lg font-semibold">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Smith"
                  required
                  className="w-full px-4 py-1.5 mt-1 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>

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
            <div className="mt-4">
              <label className="text-lg font-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                required
                className="w-full mt-1 px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none "
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full h-10 disabled:bg-blue-100 disabled:text-black bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <NavLink to="/login" className="text-blue-600 hover:underline">
                Login
              </NavLink>
            </p>
          </div>
        </div>
      )}
      {currentView === "otp" && (
        <OTPVerification
          email="mayur@mail.com"
          onVerificationSuccess={() => {}}
          onBackToLogin={() => {}}
        />
      )}
    </div>
  );
}

export default Signup;
