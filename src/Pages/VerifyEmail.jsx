import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import * as motion from "motion/react-client";
import { CheckCircle2, XCircle } from "lucide-react";
import AuthNavigation from "@/components/AuthNavigation";
import api from "@/lib/api";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const fired = useRef(false);
  const token = params.get("token");
  const [status, setStatus] = useState(token ? "verifying" : "failed"); // verifying | success | failed
  const [message, setMessage] = useState(
    token ? "" : "This verification link is invalid.",
  );

  useEffect(() => {
    if (fired.current || !token) return;
    fired.current = true;
    api
      .get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/login", { replace: true }), 2500);
      })
      .catch((err) => {
        setStatus("failed");
        setMessage(
          err.response?.data?.message ||
            "This verification link is invalid or has expired.",
        );
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <AuthNavigation />
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          {status === "verifying" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-neutral-500">Verifying your email…</p>
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 size={52} className="text-emerald-500" />
              <h1 className="text-lg font-semibold text-neutral-800">Email verified!</h1>
              <p className="text-sm text-neutral-500">
                You can now log in. Redirecting…
              </p>
              <Link to="/login" className="text-[#ff7f11] text-sm hover:underline mt-1">
                Go to login
              </Link>
            </div>
          )}
          {status === "failed" && (
            <div className="flex flex-col items-center gap-3">
              <XCircle size={52} className="text-red-500" />
              <h1 className="text-lg font-semibold text-neutral-800">
                Verification failed
              </h1>
              <p className="text-sm text-neutral-500">{message}</p>
              <Link
                to="/login"
                className="bg-[#ff7f11] text-white px-5 py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00] mt-2"
              >
                Back to login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
