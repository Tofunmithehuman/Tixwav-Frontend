import { useState, useEffect } from "react";
import { Mail, Eye, EyeClosed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import GoogleIcon from "../assets/google.svg";
import AuthNavigation from "@/components/AuthNavigation";
import * as motion from "motion/react-client";
import {
  registerUser,
  clearError,
  selectAuthLoading,
  selectAuth,
} from "../store/slices/authSlice";
import { becomeOrganizer } from "../store/slices/organizerSlice";


function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [accountType, setAccountType] = useState("user"); // "user" | "organizer"

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const { error, isAuthenticated } = useSelector(selectAuth);

  // Redirect away only if already logged in on mount (post-register nav is handled below)
  useEffect(() => {
    if (isAuthenticated) navigate("/profile", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstNameInput || !lastNameInput || !emailInput || !passwordInput) {
      toast.warning("Please fill in all fields.");
      return;
    }
    if (passwordInput.length < 8) {
      toast.warning("Password must be at least 8 characters.");
      return;
    }
    dispatch(
      registerUser({
        firstName: firstNameInput,
        lastName: lastNameInput,
        email: emailInput,
        password: passwordInput,
      }),
    )
      .unwrap()
      .then(async (data) => {
        if (accountType === "organizer") {
          try {
            await dispatch(becomeOrganizer({})).unwrap();
          } catch {
            // non-fatal — they can finish onboarding from the dashboard
          }
          toast.success("Account created! Let's set up your payouts.");
          navigate("/organizer/payout", { replace: true });
        } else {
          toast.success(
            data.message || "Account created! Please verify your email.",
          );
          navigate("/profile", { replace: true });
        }
      })
      .catch(() => {}); // error handled by useEffect above
  };

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/google`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthNavigation />
      <section className="Auth flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          className="w-11/12 max-w-100 p-4 sm:p-0 bg-white"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
                <motion.div className="text-center" variants={itemVariants}>
                  <h1 className="text-base sm:text-xl text-neutral-600 font-semibold mb-1">
                    Register
                  </h1>
                  <p className="text-[10px] sm:text-sm text-neutral-400">
                    Enter your credentials to create your account
                  </p>
                </motion.div>

                {/* Account type */}
                <motion.div
                  className="mt-6 grid grid-cols-2 gap-2"
                  variants={itemVariants}
                >
                  {[
                    { key: "user", title: "Attendee", sub: "Buy tickets" },
                    { key: "organizer", title: "Organizer", sub: "Sell tickets" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setAccountType(opt.key)}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        accountType === opt.key
                          ? "border-[#ff7f11] bg-[#ff7f11]/5"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${accountType === opt.key ? "text-[#ff7f11]" : "text-neutral-700"}`}
                      >
                        {opt.title}
                      </p>
                      <p className="text-[11px] text-neutral-400">{opt.sub}</p>
                    </button>
                  ))}
                </motion.div>

                <motion.div className="mt-10" variants={formVariants}>
                  <form onSubmit={handleSubmit}>
                    <motion.div
                      className="flex flex-col gap-6"
                      variants={containerVariants}
                    >
                      {/* Name row */}
                      <motion.div
                        className="flex items-center gap-4"
                        variants={itemVariants}
                      >
                        <label htmlFor="firstName" className="w-full">
                          <p className="text-xs text-neutral-600 font-semibold mb-1">
                            FIRST NAME
                          </p>
                          <motion.div className="border border-neutral-200 focus-within:border-[#ff7f11ff] rounded px-4 transition-colors">
                            <input
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={firstNameInput}
                              onChange={(e) =>
                                setFirstNameInput(e.target.value)
                              }
                              className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                              autoComplete="given-name"
                            />
                          </motion.div>
                        </label>
                        <label htmlFor="lastName" className="w-full">
                          <p className="text-xs text-neutral-600 font-semibold mb-1">
                            LAST NAME
                          </p>
                          <motion.div className="border border-neutral-200 focus-within:border-[#ff7f11ff] rounded px-4 transition-colors">
                            <input
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={lastNameInput}
                              onChange={(e) => setLastNameInput(e.target.value)}
                              className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                              autoComplete="family-name"
                            />
                          </motion.div>
                        </label>
                      </motion.div>

                      {/* Email */}
                      <motion.label htmlFor="email" variants={itemVariants}>
                        <p className="text-xs text-neutral-600 font-semibold mb-1">
                          EMAIL ADDRESS
                        </p>
                        <motion.div className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11ff] rounded px-4 transition-colors">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                            autoComplete="email"
                          />
                          <motion.div
                            animate={{ scale: emailInput ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Mail className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        </motion.div>
                      </motion.label>

                      {/* Password */}
                      <motion.label htmlFor="password" variants={itemVariants}>
                        <p className="text-xs text-neutral-600 font-semibold mb-1">
                          PASSWORD
                        </p>
                        <motion.div className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11ff] rounded px-4 transition-colors">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                            autoComplete="new-password"
                          />
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? (
                              <Eye
                                className="w-5 h-5 cursor-pointer text-gray-400"
                                onClick={() => setShowPassword(false)}
                              />
                            ) : (
                              <EyeClosed
                                className="w-5 h-5 cursor-pointer text-gray-400"
                                onClick={() => setShowPassword(true)}
                              />
                            )}
                          </motion.div>
                        </motion.div>
                        {passwordInput.length > 0 &&
                          passwordInput.length < 8 && (
                            <p className="text-xs text-amber-500 mt-1">
                              Minimum 8 characters
                            </p>
                          )}
                      </motion.label>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#ff7f11ff] cursor-pointer text-white py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        variants={itemVariants}
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating account…
                          </>
                        ) : (
                          "Get started"
                        )}
                      </motion.button>
                    </motion.div>
                  </form>

                  {/* Divider */}
                  <motion.div
                    className="flex items-center justify-center gap-2 mt-6"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className="w-full h-px bg-neutral-200" />
                    <p className="text-sm text-neutral-500">or</p>
                    <div className="w-full h-px bg-neutral-200" />
                  </motion.div>

                  <motion.button
                    onClick={handleGoogleRegister}
                    className="w-full cursor-pointer bg-white border-2 border-neutral-200 text-neutral-500 py-3 rounded-xs text-sm font-semibold hover:bg-neutral-100 transition duration-200 flex items-center justify-center gap-2 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                     <img src={GoogleIcon} alt="Google" className="w-4 h-4" />
                    Register with Google
                  </motion.button>

                  <motion.p
                    className="text-xs text-neutral-500 text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Already have an account?{" "}
                    <motion.span whileHover={{ x: 3 }} className="inline-block">
                      <Link
                        to="/login"
                        className="text-[#ff7f11ff] text-xs ms-1"
                      >
                        Login
                      </Link>
                    </motion.span>
                  </motion.p>
                </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default Register;
