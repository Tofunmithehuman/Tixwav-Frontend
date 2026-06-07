import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as motion from "motion/react-client";
import { Building2, BadgeCheck, Wallet, BarChart3 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { selectUser } from "@/store/slices/authSlice";
import {
  becomeOrganizer,
  selectIsBecoming,
} from "@/store/slices/organizerSlice";

const perks = [
  { icon: BadgeCheck, text: "Create unlimited events & ticket tiers" },
  { icon: Wallet, text: "Keep 90% of every sale, paid to your bank" },
  { icon: BarChart3, text: "Real-time analytics for your events" },
];

const BecomeOrganizer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isBecoming = useSelector(selectIsBecoming);

  const [form, setForm] = useState({ companyName: "", website: "", description: "" });

  useEffect(() => {
    // Already an organizer/admin? Skip straight to the dashboard.
    if (user && user.role !== "user") navigate("/organizer", { replace: true });
  }, [user, navigate]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(becomeOrganizer(form))
      .unwrap()
      .then(() => {
        toast.success("You're now an organizer! Let's set up payouts.");
        navigate("/organizer/payout");
      })
      .catch((err) => toast.error(err || "Could not upgrade your account."));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ff7f11]/10 flex items-center justify-center mx-auto mb-4">
              <Building2 size={26} className="text-[#ff7f11]" />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-800">
              Become an organizer
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              Start selling tickets to your events in minutes.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {perks.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-neutral-100 rounded-xl p-4 text-center"
              >
                <p.icon size={20} className="text-[#ff7f11] mx-auto mb-2" />
                <p className="text-xs text-neutral-500 leading-snug">{p.text}</p>
              </motion.div>
            ))}
          </div>

          <form
            onSubmit={submit}
            className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-neutral-600">
                ORGANIZATION / BRAND NAME
              </label>
              <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="e.g. Lagos Live Events"
                className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-[#ff7f11]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600">
                WEBSITE (OPTIONAL)
              </label>
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://"
                className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-[#ff7f11]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600">
                ABOUT YOU (OPTIONAL)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Tell attendees about the events you host"
                className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7f11] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isBecoming}
              className="w-full bg-[#ff7f11] text-white py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isBecoming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Upgrading…
                </>
              ) : (
                "Become an organizer"
              )}
            </button>
            <p className="text-[11px] text-neutral-400 text-center">
              You'll add your payout bank details next.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeOrganizer;
