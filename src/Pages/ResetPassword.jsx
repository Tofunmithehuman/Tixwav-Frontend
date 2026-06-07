import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Eye, EyeClosed } from "lucide-react";
import * as motion from "motion/react-client";
import AuthNavigation from "@/components/AuthNavigation";
import { resetPassword, selectAuth } from "@/store/slices/authSlice";

function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isResetLoading } = useSelector(selectAuth);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!token) toast.error("Invalid or missing reset link.");
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) return;
    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.warning("Passwords don't match.");
      return;
    }
    dispatch(resetPassword({ token, password }))
      .unwrap()
      .then(() => {
        toast.success("Password reset! Please log in.");
        navigate("/login", { replace: true });
      })
      .catch((err) => toast.error(err || "Reset failed. Request a new link."));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <AuthNavigation />
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-11/12 max-w-100 bg-white"
        >
          <div className="text-center mb-8">
            <h1 className="text-xl text-neutral-600 font-semibold mb-1">
              Reset password
            </h1>
            <p className="text-sm text-neutral-400">Choose a new password</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label>
              <p className="text-xs text-neutral-600 font-semibold mb-1">
                NEW PASSWORD
              </p>
              <div className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11] rounded px-4">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full focus:outline-none py-3 text-base text-neutral-500 bg-transparent"
                  autoComplete="new-password"
                />
                {show ? (
                  <Eye
                    className="w-5 h-5 cursor-pointer text-gray-400"
                    onClick={() => setShow(false)}
                  />
                ) : (
                  <EyeClosed
                    className="w-5 h-5 cursor-pointer text-gray-400"
                    onClick={() => setShow(true)}
                  />
                )}
              </div>
            </label>

            <label>
              <p className="text-xs text-neutral-600 font-semibold mb-1">
                CONFIRM PASSWORD
              </p>
              <div className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11] rounded px-4">
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full focus:outline-none py-3 text-base text-neutral-500 bg-transparent"
                  autoComplete="new-password"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isResetLoading || !token}
              className="w-full bg-[#ff7f11] text-white py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isResetLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting…
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>

          <p className="text-xs text-neutral-500 text-center mt-6">
            Remembered it?{" "}
            <Link to="/login" className="text-[#ff7f11] ms-1">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;
