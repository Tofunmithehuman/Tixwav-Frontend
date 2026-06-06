import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as motion from "motion/react-client";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyOrder } from "@/store/slices/orderSlice";

/**
 * Paystack redirects here after checkout:
 *   /payment/verify?reference=...&trxref=...
 * We confirm the payment with the backend, then route to the order page.
 */
const PaymentVerify = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fired = useRef(false);
  const reference = params.get("reference") || params.get("trxref");
  const [status, setStatus] = useState(reference ? "verifying" : "failed"); // verifying | success | failed
  const [message, setMessage] = useState(
    reference ? "" : "Missing payment reference.",
  );

  useEffect(() => {
    if (fired.current || !reference) return;
    fired.current = true;

    dispatch(verifyOrder(reference))
      .unwrap()
      .then((data) => {
        setStatus("success");
        const orderId = data.order?._id;
        // Brief success screen, then go to the order/tickets page
        setTimeout(() => navigate(`/orders/${orderId}`, { replace: true }), 1500);
      })
      .catch((err) => {
        setStatus("failed");
        setMessage(typeof err === "string" ? err : "We couldn't confirm your payment.");
      });
  }, [dispatch, navigate, reference]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#fffffc] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <Link to="/" className="QurovaDEMO text-[#ff7f11] text-3xl">
          Tixwav
        </Link>

        {status === "verifying" && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-neutral-500">Confirming your payment…</p>
          </div>
        )}

        {status === "success" && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <CheckCircle2 size={56} className="text-emerald-500" />
            <h1 className="text-lg font-semibold text-neutral-800">Payment confirmed!</h1>
            <p className="text-sm text-neutral-500">
              Your tickets are being generated and emailed to you. Redirecting…
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <XCircle size={56} className="text-red-500" />
            <h1 className="text-lg font-semibold text-neutral-800">Payment not confirmed</h1>
            <p className="text-sm text-neutral-500">{message}</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => navigate("/discover")}
                className="bg-[#ff7f11] text-white px-5 py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00]"
              >
                Browse events
              </button>
              <Link
                to="/profile"
                className="border border-neutral-200 text-neutral-600 px-5 py-2.5 rounded-xs text-sm font-semibold hover:border-[#ff7f11] hover:text-[#ff7f11]"
              >
                My tickets
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentVerify;
