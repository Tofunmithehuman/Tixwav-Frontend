import React, { useState } from "react";
import { Mail, Eye, EyeClosed } from "lucide-react";
import google from "../assets/google.svg";
import { Link } from "react-router-dom";
import AuthNavigation from "@/components/AuthNavigation";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AuthNavigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <section className="flex-1 overflow-auto">
          <div className="max-w-360 m-auto h-full">
            <div className="Auth flex justify-center items-center h-full">
              <div className="w-11/12 max-w-100 p-4 sm:p-0 bg-white">
                <div className="text-center">
                  <h1 className="text-base sm:text-xl text-neutral-600 font-semibold mb-1">
                    Log In
                  </h1>
                  <p className="text-[10px] sm:text-sm text-neutral-400">
                    Enter your credentials to access your account
                  </p>
                </div>

                <div className="mt-10">
                  <form>
                    <div className="flex flex-col gap-6">
                      <label htmlFor="email">
                        <p className="text-xs text-neutral-600 font-semibold mb-1">
                          EMAIL ADDRESS
                        </p>
                        <div className="flex items-center border border-neutral-200 focus-within:border-primary-200 rounded px-4">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                          />
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                      </label>

                      <label htmlFor="password">
                        <p className="text-xs text-neutral-600 font-semibold mb-1">
                          PASSWORD
                        </p>
                        <div className="flex items-center border border-neutral-200 focus-within:border-primary-200 rounded px-4">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                             className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                          />
                          {showPassword ? (
                            <Eye
                              className="w-5 h-5 cursor-pointer text-gray-400"
                              onClick={togglePasswordVisibility}
                            />
                          ) : (
                            <EyeClosed
                              className="w-5 h-5 cursor-pointer text-gray-400"
                              onClick={togglePasswordVisibility}
                            />
                          )}
                        </div>
                      </label>

                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="remember"
                          className="flex items-center gap-1"
                        >
                          <input
                            type="checkbox"
                            name="remember"
                            id="remember"
                            className="cursor-pointer"
                          />
                          <p className="text-neutral-500 text-xs">
                            Remember me for 30 days
                          </p>
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-[#ff7f11ff]  text-xs"
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#ff7f11ff] cursor-pointer text-white py-3 rounded-xs text-sm font-semibold hover:bg-primary-600 transition duration-200"
                      >
                        Log into Account
                      </button>
                    </div>
                  </form>

                  <div className="flex items-center justify-center gap-2 mt-6">
                    <div className="w-full h-px bg-neutral-200"></div>
                    <p className="text-sm text-neutral-500">or</p>
                    <div className="w-full h-px bg-neutral-200"></div>
                  </div>

                  <button className="w-full cursor-pointer bg-white border-2 border-neutral-200 text-neutral-500 py-3 rounded-xs text-sm font-semibold hover:bg-neutral-100 transition duration-200 flex items-center justify-center gap-2 mt-4">
                    <img src={google} alt="Google" className="w-4 h-4" />
                    Continue with Google
                  </button>

                  <p className="text-xs text-neutral-500 text-center mt-6">
                    Are you new here?
                    <Link
                      to="/register"
                      className="text-[#ff7f11ff] text-xs ms-1"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
