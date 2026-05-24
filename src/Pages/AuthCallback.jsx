import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { exchangeOAuthCode } from "../store/slices/authSlice";

/**
 * Landing page for Google OAuth redirect.
 * The server redirects here with ?code=<one-time-code>
 * We exchange that code for JWT tokens and redirect to /profile.
 */
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFired = useRef(false);

  useEffect(() => {
    // Strict Mode fires effects twice in dev — guard against double exchange
    if (hasFired.current) return;
    hasFired.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google sign-in failed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    if (!code) {
      toast.error("Invalid callback. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    dispatch(exchangeOAuthCode({ code }))
      .unwrap()
      .then(() => {
        toast.success("Signed in with Google");
        navigate("/profile", { replace: true });
      })
      .catch((err) => {
        toast.error(err || "Sign-in failed. Please try again.");
        navigate("/login", { replace: true });
      });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <span className="QurovaDEMO text-[#ff7f11] text-3xl">Tixwav</span>
        <p className="text-neutral-500 text-sm">Completing sign-in…</p>
        <div className="w-6 h-6 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default AuthCallback;