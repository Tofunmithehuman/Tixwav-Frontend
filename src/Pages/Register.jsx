import { useState } from "react";
import { Mail, Eye, EyeClosed } from "lucide-react";
import google from "../assets/google.svg";
import { Link } from "react-router-dom";
import AuthNavigation from "@/components/AuthNavigation";
import * as motion from "motion/react-client";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
                    Register
                  </h1>
                  <p className="text-[10px] sm:text-sm text-neutral-400">
                    Enter your credentials to create your account
                  </p>
                </motion.div>

                <motion.div className="mt-10" variants={formVariants}>
                  <form>
                    <motion.div
                      className="flex flex-col gap-6"
                      variants={containerVariants}
                    >
                      <motion.div
                        className="flex items-center gap-4"
                        variants={itemVariants}
                      >
                        <label htmlFor="firstName" className="w-full">
                          <p className="text-xs text-neutral-600 font-semibold mb-1">
                            FIRST NAME
                          </p>
                          <motion.div
                            className="border border-neutral-200 focus-within:border-[#ff7f11ff] rounded px-4 transition-colors"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <input
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={firstNameInput}
                              onChange={(e) =>
                                setFirstNameInput(e.target.value)
                              }
                              className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                            />
                          </motion.div>
                        </label>

                        <label htmlFor="lastName" className="w-full">
                          <p className="text-xs text-neutral-600 font-semibold mb-1">
                            LAST NAME
                          </p>
                          <motion.div
                            className="border border-neutral-200 focus-within:border-[#ff7f11ff] rounded px-4 transition-colors"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <input
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={lastNameInput}
                              onChange={(e) => setLastNameInput(e.target.value)}
                              className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                            />
                          </motion.div>
                        </label>
                      </motion.div>

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

                      <motion.label htmlFor="password" variants={itemVariants}>
                        <p className="text-xs text-neutral-600 font-semibold mb-1">
                          PASSWORD
                        </p>
                        <motion.div
                          className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11ff] rounded px-4 transition-colors"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full focus:outline-none focus:ring-0 py-3 text-base text-neutral-500 bg-transparent"
                          />
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
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
                        Get started
                      </motion.button>
                    </motion.div>
                  </form>

                  <motion.div
                    className="flex items-center justify-center gap-2 mt-6"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className="w-full h-px bg-neutral-200"></div>
                    <p className="text-sm text-neutral-500">or</p>
                    <div className="w-full h-px bg-neutral-200"></div>
                  </motion.div>

                  <motion.button
                    className="w-full cursor-pointer bg-white border-2 border-neutral-200 text-neutral-500 py-3 rounded-xs text-sm font-semibold hover:bg-neutral-100 transition duration-200 flex items-center justify-center gap-2 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.02, borderColor: "#ff7f11ff" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.img
                      src={google}
                      alt="Google"
                      className="w-4 h-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    />
                    Register with Google
                  </motion.button>

                  <motion.p
                    className="text-xs text-neutral-500 text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Already have an account?
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
