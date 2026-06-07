import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import * as motion from "motion/react-client";
import { Link } from "react-router-dom";
import {
  Wallet,
  Banknote,
  BarChart3,
  Ticket,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

const points = [
  {
    icon: Ticket,
    title: "Free to create & list",
    text: "Publish unlimited events and ticket tiers at no cost. No monthly fees, no setup charges.",
  },
  {
    icon: Wallet,
    title: "Keep 90% of every sale",
    text: "Tixwav takes a flat 10% per paid ticket — the other 90% is yours, automatically.",
  },
  {
    icon: Banknote,
    title: "Paid straight to your bank",
    text: "Your share is split to your bank at checkout via Paystack — no waiting, no manual payouts.",
  },
  {
    icon: BarChart3,
    title: "Only pay when you sell",
    text: "Free events cost you nothing. You're only charged the 10% on tickets that actually sell.",
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" },
});

const Pricing = () => {
  const example = 10000; // ₦10,000 example ticket
  const organizerCut = example * 0.9;
  const platformCut = example * 0.1;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />

      <main className="flex-1 px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <motion.div className="text-center" {...fade(0)}>
            <p className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-neutral-800 tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-neutral-500 mt-3 max-w-xl mx-auto">
              No plans. No monthly fees. No setup costs. You only pay when you
              sell a ticket — and you always keep the lion's share.
            </p>
          </motion.div>

          {/* Split card */}
          <motion.div
            className="mt-10 bg-white border border-neutral-100 rounded-3xl shadow-sm p-6 md:p-10"
            {...fade(0.1)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl bg-[#ff7f11]/8 border border-[#ff7f11]/20 p-6 text-center">
                <p className="text-5xl md:text-6xl font-bold text-[#ff7f11]">90%</p>
                <p className="mt-2 text-sm font-semibold text-neutral-700">
                  Goes to the organizer
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Your earnings on every paid ticket
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6 text-center">
                <p className="text-5xl md:text-6xl font-bold text-neutral-800">10%</p>
                <p className="mt-2 text-sm font-semibold text-neutral-700">
                  Goes to Tixwav
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Our only fee — covers payments & platform
                </p>
              </div>
            </div>

            {/* Visual split bar */}
            <div className="mb-2 flex items-center justify-between text-xs font-medium">
              <span className="text-[#ff7f11]">Organizer · 90%</span>
              <span className="text-neutral-500">Tixwav · 10%</span>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#ff7f11]"
                initial={{ width: 0 }}
                animate={{ width: "90%" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
              <div className="bg-neutral-300 flex-1" />
            </div>

            {/* Worked example */}
            <div className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-5">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Example
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-neutral-500">
                  Sell a <strong className="text-neutral-800">{fmt(example)}</strong> ticket
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[#ff7f11] font-semibold">
                    You get {fmt(organizerCut)}
                  </span>
                  <span className="text-neutral-400">
                    Tixwav {fmt(platformCut)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {points.map((p, i) => (
              <motion.div
                key={p.title}
                className="bg-white border border-neutral-100 rounded-2xl p-5 flex gap-4"
                {...fade(0.15 + i * 0.07)}
              >
                <div className="w-10 h-10 rounded-xl bg-[#ff7f11]/10 flex items-center justify-center shrink-0">
                  <p.icon size={18} className="text-[#ff7f11]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{p.title}</p>
                  <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                    {p.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reassurance + CTA */}
          <motion.div
            className="mt-8 text-center bg-white border border-neutral-100 rounded-3xl p-8"
            {...fade(0.45)}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ff7f11]/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={22} className="text-[#ff7f11]" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800">
              Free for attendees. Fair for organizers.
            </h2>
            <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
              Buying tickets is always free. Hosting is free too — designed for seamless event experiences.
            </p>
            <motion.div
              className="mt-6"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/become-organizer"
                className="inline-flex items-center gap-2 bg-[#ff7f11] text-white px-6 py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition-colors"
              >
                Start selling tickets <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Pricing;
