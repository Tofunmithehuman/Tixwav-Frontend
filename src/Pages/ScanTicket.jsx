import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Html5Qrcode } from "html5-qrcode";
import * as motion from "motion/react-client";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Camera,
  CameraOff,
  ScanLine,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import {
  verifyTicket,
  clearScanResult,
  selectScanResult,
  selectIsVerifying,
} from "@/store/slices/ticketSlice";

const REGION_ID = "tixwav-qr-region";

const ScanTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const result = useSelector(selectScanResult);
  const isVerifying = useSelector(selectIsVerifying);

  const scannerRef = useRef(null);
  const runningRef = useRef(false);
  const lockRef = useRef(false); // prevents duplicate scans of the same frame burst
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manual, setManual] = useState("");

  // Extract the ticket code from a scanned QR (our QR encodes JSON; fall back to raw text)
  const extractCode = (text) => {
    try {
      const obj = JSON.parse(text);
      return obj.ticketCode || text;
    } catch {
      return text.trim();
    }
  };

  const submitCode = (code) => {
    if (!code) return;
    dispatch(verifyTicket(code));
  };

  const stopScanner = async () => {
    const s = scannerRef.current;
    if (s && runningRef.current) {
      try {
        await s.stop();
        await s.clear();
      } catch {
        /* ignore */
      }
      runningRef.current = false;
    }
    setCameraOn(false);
  };

  const startScanner = async () => {
    setCameraError("");
    dispatch(clearScanResult());
    lockRef.current = false;
    try {
      if (!scannerRef.current) scannerRef.current = new Html5Qrcode(REGION_ID);
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          aspectRatio: 1.0,
          // Square scan box sized to the smaller side of the viewfinder, so it
          // stays a square (not a wide rectangle) on any screen.
          qrbox: (vw, vh) => {
            const size = Math.floor(Math.min(vw, vh) * 0.7);
            return { width: size, height: size };
          },
        },
        (decoded) => {
          if (lockRef.current) return;
          lockRef.current = true;
          const code = extractCode(decoded);
          stopScanner().then(() => submitCode(code));
        },
        () => {}, // per-frame decode errors: ignore
      );
      runningRef.current = true;
      setCameraOn(true);
    } catch {
      setCameraError(
        "Couldn't access the camera. Grant permission or enter the code manually.",
      );
      setCameraOn(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
      dispatch(clearScanResult());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanNext = () => {
    dispatch(clearScanResult());
    setManual("");
    startScanner();
  };

  const t = result?.ticket;
  const valid = result?.valid;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#ff7f11] mb-4"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="flex items-center gap-2 mb-1">
            <ScanLine size={22} className="text-[#ff7f11]" />
            <h1 className="text-xl font-semibold text-neutral-800">
              Verify tickets
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mb-5">
            Scan a ticket's QR code at the door, or enter the code by hand.
          </p>

          {/* Result card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl p-5 mb-5 border ${
                valid
                  ? "bg-emerald-50 border-emerald-200"
                  : result.message?.toLowerCase().includes("already")
                    ? "bg-amber-50 border-amber-200"
                    : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {valid ? (
                  <CheckCircle2 size={26} className="text-emerald-600" />
                ) : result.message?.toLowerCase().includes("already") ? (
                  <AlertTriangle size={26} className="text-amber-600" />
                ) : (
                  <XCircle size={26} className="text-red-600" />
                )}
                <div>
                  <p
                    className={`font-semibold ${
                      valid
                        ? "text-emerald-800"
                        : result.message?.toLowerCase().includes("already")
                          ? "text-amber-800"
                          : "text-red-800"
                    }`}
                  >
                    {valid
                      ? "Valid ticket"
                      : result.message || "Invalid ticket"}
                  </p>
                  {result.usedAt && (
                    <p className="text-xs text-amber-700">
                      Used {new Date(result.usedAt).toLocaleString("en-NG")}
                    </p>
                  )}
                </div>
              </div>
              {t && (
                <div className="text-sm text-neutral-600 mt-1 pl-9">
                  <p className="font-medium text-neutral-800">
                    {t.holderName || t.holder?.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {t.tierName} · {t.ticketCode}
                  </p>
                </div>
              )}
              <button
                onClick={scanNext}
                className="w-full mt-4 bg-[#ff7f11] text-white py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00]"
              >
                Scan next
              </button>
            </motion.div>
          )}

          {/* Scanner */}
          {!result && (
            <>
              <div className="bg-black rounded-2xl overflow-hidden aspect-square relative">
                <div
                  id={REGION_ID}
                  className="w-full h-full [&_video]:object-cover"
                />
                {!cameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 gap-3">
                    {isVerifying ? (
                      <>
                        <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm">Verifying…</p>
                      </>
                    ) : (
                      <>
                        <Camera size={34} />
                        <p className="text-sm px-6 text-center">
                          {cameraError || "Camera is off"}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                {!cameraOn ? (
                  <button
                    onClick={startScanner}
                    disabled={isVerifying}
                    className="flex-1 bg-[#ff7f11] text-white py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <Camera size={15} /> Start camera
                  </button>
                ) : (
                  <button
                    onClick={stopScanner}
                    className="flex-1 border border-neutral-200 text-neutral-600 py-2.5 rounded-xs text-sm font-semibold hover:border-[#ff7f11] hover:text-[#ff7f11] flex items-center justify-center gap-2"
                  >
                    <CameraOff size={15} /> Stop camera
                  </button>
                )}
              </div>

              {/* Manual entry */}
              <div className="mt-5 bg-white border border-neutral-100 rounded-2xl p-4">
                <p className="text-xs font-semibold text-neutral-500 mb-2">
                  Or enter the ticket code
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitCode(manual.trim().toUpperCase());
                  }}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input
                    value={manual}
                    onChange={(e) => setManual(e.target.value)}
                    placeholder="e.g. A1B2C3D4E5F6"
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-base uppercase tracking-wide focus:outline-none focus:border-[#ff7f11]"
                  />
                  <button
                    disabled={isVerifying || !manual.trim()}
                    className="w-full sm:w-auto bg-neutral-800 text-white px-6 py-2.5 rounded-xs text-sm font-semibold hover:bg-neutral-700 disabled:opacity-50"
                  >
                    Verify
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScanTicket;
