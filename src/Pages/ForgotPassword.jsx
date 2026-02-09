import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AuthNavigation from "@/components/AuthNavigation";
import * as motion from "motion/react-client";

function ForgotPassword() {
  const [emailInput, setEmailInput] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AuthNavigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <section className="flex-1 overflow-auto">
          <div className="max-w-360 m-auto h-full">
            <div className="Auth flex justify-center items-center h-full">
              <motion.div
                className="w-11/12 max-w-100 p-4 sm:p-0 bg-white"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div className="text-center" variants={itemVariants}>
                  <h1 className="text-base sm:text-xl text-neutral-600 font-semibold mb-1">
                    Forgot Password
                  </h1>
                  <p className="text-[10px] sm:text-sm text-neutral-400">
                    Enter your email to reset your password
                  </p>
                </motion.div>

                <motion.div className="mt-10" variants={formVariants}>
                  <form>
                    <motion.div
                      className="flex flex-col gap-6"
                      variants={containerVariants}
                    >
                      <motion.label htmlFor="email" variants={itemVariants}>
                        <p className="text-xs text-neutral-600 font-semibold mb-1">
                          EMAIL ADDRESS
                        </p>
                        <motion.div
                          className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11ff] rounded px-4 transition-colors"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
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
                        className="w-full bg-[#ff7f11ff] cursor-pointer text-white py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition duration-200"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Send OTP
                      </motion.button>
                    </motion.div>
                  </form>

                  <motion.div
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <motion.span whileHover={{ x: -3 }} className="inline-block">
                      <Link to="/login" className="text-[#ff7f11ff] text-xs">
                        Back to login
                      </Link>
                    </motion.span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ForgotPassword;