import { useState, useEffect } from "react";
import { Mail, Eye, EyeClosed } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import GoogleIcon from "../assets/google.svg";
import AuthNavigation from "@/components/AuthNavigation";
import * as motion from "motion/react-client";
import {
  loginUser,
  clearError,
  selectAuthLoading,
  selectAuth,
} from "../store/slices/authSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectAuthLoading);
  const { error, isAuthenticated } = useSelector(selectAuth);

  // Redirect destination after login (supports ProtectedRoute redirect)
  const from = location.state?.from?.pathname || "/profile";

  // If already authenticated, send to profile
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated]);

  // Show Redux error as toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      toast.warning("Please fill in all fields.");
      return;
    }
    dispatch(loginUser({ email: emailInput, password: passwordInput }))
      .unwrap()
      .then((data) => {
        toast.success(data.message || "Welcome back!");
        navigate(from, { replace: true });
      })
      .catch(() => {}); // error handled by useEffect above
  };

  const handleGoogleLogin = () => {
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
          className="w-11/12 max-w-100 p-4 sm:p-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
                {/* Header */}
                <motion.div className="text-center" variants={itemVariants}>
                  <h1 className="text-base sm:text-xl text-neutral-600 font-semibold mb-1">
                    Log In
                  </h1>
                  <p className="text-[10px] sm:text-sm text-neutral-400">
                    Enter your credentials to access your account
                  </p>
                </motion.div>

                <motion.div className="mt-10" variants={formVariants}>
                  <form onSubmit={handleSubmit}>
                    <motion.div
                      className="flex flex-col gap-6"
                      variants={containerVariants}
                    >
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
                            autoComplete="current-password"
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
                      </motion.label>

                      {/* Remember / Forgot */}
                      <motion.div
                        className="flex items-center justify-between"
                        variants={itemVariants}
                      >
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
                        <motion.div whileHover={{ x: 3 }}>
                          <Link
                            to="/forgot-password"
                            className="text-[#ff7f11ff] text-xs"
                          >
                            Forgot Password?
                          </Link>
                        </motion.div>
                      </motion.div>

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
                            Signing in…
                          </>
                        ) : (
                          "Log into Account"
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

                  {/* Google */}
                  <motion.button
                    onClick={handleGoogleLogin}
                    className="w-full cursor-pointer bg-white border-2 border-neutral-200 text-neutral-500 py-3 rounded-xs text-sm font-semibold hover:bg-neutral-100 transition duration-200 flex items-center justify-center gap-2 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img src={GoogleIcon} alt="Google" className="w-4 h-4" />
                    Continue with Google
                  </motion.button>

                  <motion.p
                    className="text-xs text-neutral-500 text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Are you new here?{" "}
                    <motion.span whileHover={{ x: 3 }} className="inline-block">
                      <Link
                        to="/register"
                        className="text-[#ff7f11ff] text-xs ms-1"
                      >
                        Create Account
                      </Link>
                    </motion.span>
                  </motion.p>
                </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default Login;
