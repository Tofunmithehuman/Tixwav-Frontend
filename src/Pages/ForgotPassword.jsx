import { useState, useEffect } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AuthNavigation from "@/components/AuthNavigation";
import * as motion from "motion/react-client";
import { forgotPassword, clearError } from "../store/slices/authSlice";

function ForgotPassword() {
  const [emailInput, setEmailInput] = useState("");
  const [sent, setSent] = useState(false);

  const dispatch = useDispatch();
  const { isForgotLoading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) {
      toast.warning("Please enter your email address.");
      return;
    }
    dispatch(forgotPassword({ email: emailInput }))
      .unwrap()
      .then((data) => {
        setSent(true);
        toast.success(data.message || "Reset link sent!");
      })
      .catch(() => {}); // error handled by useEffect
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
                {sent ? (
                  /* ── Success state ─────────────────────────────────────── */
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={28} className="text-emerald-500" />
                    </div>
                    <h1 className="text-base sm:text-xl text-neutral-600 font-semibold mb-1">
                      Check your email
                    </h1>
                    <p className="text-[10px] sm:text-sm text-neutral-400 mb-6">
                      We've sent a password reset link to{" "}
                      <span className="font-medium text-neutral-600">
                        {emailInput}
                      </span>
                    </p>
                    <p className="text-xs text-neutral-400 mb-4">
                      Didn't receive it?{" "}
                      <button
                        onClick={() => setSent(false)}
                        className="text-[#ff7f11ff] hover:underline"
                      >
                        Try again
                      </button>
                    </p>
                    <Link to="/login" className="text-[#ff7f11ff] text-xs">
                      Back to login
                    </Link>
                  </motion.div>
                ) : (
                  /* ── Form state ────────────────────────────────────────── */
                  <>
                    <motion.div className="text-center" variants={itemVariants}>
                      <h1 className="text-base sm:text-xl text-neutral-600 font-semibold mb-1">
                        Forgot Password
                      </h1>
                      <p className="text-[10px] sm:text-sm text-neutral-400">
                        Enter your email to reset your password
                      </p>
                    </motion.div>

                    <motion.div className="mt-10" variants={itemVariants}>
                      <form onSubmit={handleSubmit}>
                        <motion.div
                          className="flex flex-col gap-6"
                          variants={containerVariants}
                        >
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
                                animate={{
                                  scale: emailInput ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <Mail className="w-5 h-5 text-gray-400" />
                              </motion.div>
                            </motion.div>
                          </motion.label>

                          <motion.button
                            type="submit"
                            disabled={isForgotLoading}
                            className="w-full bg-[#ff7f11ff] cursor-pointer text-white py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            variants={itemVariants}
                            whileHover={{ scale: isForgotLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isForgotLoading ? 1 : 0.98 }}
                          >
                            {isForgotLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sending…
                              </>
                            ) : (
                              "Send Reset Link"
                            )}
                          </motion.button>
                        </motion.div>
                      </form>

                      <motion.div
                        className="text-center mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <motion.span
                          whileHover={{ x: -3 }}
                          className="inline-block"
                        >
                          <Link
                            to="/login"
                            className="text-[#ff7f11ff] text-xs"
                          >
                            Back to login
                          </Link>
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </>
                )}
        </motion.div>
      </section>
    </div>
  );
}

export default ForgotPassword;
