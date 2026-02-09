import React, { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AuthNavigation from "@/components/AuthNavigation";

function ForgotPassword() {
  const [emailInput, setEmailInput] = useState("");

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
                    Forgot Password
                  </h1>
                  <p className="text-[10px] sm:text-sm text-neutral-400">
                    Enter your email to reset your password
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
                            className="w-full focus:outline-none focus:ring-0 py-3 text-xs text-neutral-500 bg-transparent"
                          />
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                      </label>

                      <button
                        type="submit"
                        className="w-full bg-[#ff7f11ff] cursor-pointer text-white py-3 rounded-xs text-sm font-semibold hover:bg-primary-600 transition duration-200"
                      >
                        Send OTP
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-6">
                    <Link to="/login" className="text-[#ff7f11ff] text-xs">
                      Back to login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ForgotPassword;
