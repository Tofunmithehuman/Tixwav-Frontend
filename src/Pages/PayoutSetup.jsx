import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as motion from "motion/react-client";
import { Wallet, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SearchableSelect from "@/components/SearchableSelect";
import {
  fetchBanks,
  fetchPayout,
  savePayout,
  selectBanks,
  selectPayoutAccount,
  selectOrganizerSaving,
} from "@/store/slices/organizerSlice";

const PayoutSetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const banks = useSelector(selectBanks);
  const payout = useSelector(selectPayoutAccount);
  const saving = useSelector(selectOrganizerSaving);

  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Paystack lists some banks more than once and some with no settlement code.
  // Drop unusable entries, dedupe by name (case-insensitive), and sort.
  const bankOptions = useMemo(() => {
    const seen = new Set();
    return banks
      .filter((b) => b && b.code && b.name)
      .filter((b) => {
        const key = b.name.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((b) => ({ value: b.code, label: b.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [banks]);

  useEffect(() => {
    dispatch(fetchBanks());
    dispatch(fetchPayout());
  }, [dispatch]);

  const submit = (e) => {
    e.preventDefault();
    if (!bankCode) return toast.warning("Select your bank.");
    if (!/^\d{10}$/.test(accountNumber))
      return toast.warning("Account number must be 10 digits.");

    const bankName = banks.find((b) => b.code === bankCode)?.name || "";
    dispatch(savePayout({ bankCode, bankName, accountNumber }))
      .unwrap()
      .then(() => {
        toast.success("Payout account verified and saved!");
        setBankCode("");
        setAccountNumber("");
        dispatch(fetchPayout()); // refresh the masked details so the banner updates instantly
      })
      .catch((err) => toast.error(err || "Could not verify that account."));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-10">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate("/organizer")}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#ff7f11] mb-4"
          >
            <ArrowLeft size={15} /> Dashboard
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-[#ff7f11]/10 flex items-center justify-center">
              <Wallet size={22} className="text-[#ff7f11]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-800">Payout account</h1>
              <p className="text-xs text-neutral-400">
                Where your 90% share of each sale settles
              </p>
            </div>
          </div>

          {payout?.isActive && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 my-4 flex items-start gap-3"
            >
              <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-emerald-800">Payouts active</p>
                <p className="text-emerald-700 text-xs mt-0.5">
                  {payout.bankName} · {payout.accountName} ·{" "}
                  {payout.accountNumberMasked}
                </p>
              </div>
            </motion.div>
          )}

          <form
            onSubmit={submit}
            className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-4 mt-4"
          >
            <div>
              <label className="text-xs font-semibold text-neutral-600">BANK</label>
              <div className="mt-1">
                <SearchableSelect
                  value={bankCode}
                  onChange={setBankCode}
                  options={bankOptions}
                  placeholder="Select your bank"
                  loading={banks.length === 0}
                  ariaLabel="Select your bank"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600">
                ACCOUNT NUMBER
              </label>
              <input
                inputMode="numeric"
                maxLength={10}
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="0123456789"
                className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-[#ff7f11] tracking-wide"
              />
            </div>

            <div className="flex items-start gap-2 bg-neutral-50 rounded-lg p-3">
              <ShieldCheck size={15} className="text-[#ff7f11] mt-0.5 shrink-0" />
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                We verify your account with Paystack and create a secure subaccount.
                90% of each ticket sale is settled to you automatically; Tixwav keeps 10%.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#ff7f11] text-white py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying…
                </>
              ) : payout?.isActive ? (
                "Update payout account"
              ) : (
                "Verify & save"
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PayoutSetup;
