import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import * as motion from "motion/react-client";
import { Check, X, Zap, Building2, User, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    id: "free",
    name: "Starter",
    icon: User,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for discovering events and getting started.",
    color: "#beb7a4",
    features: [
      { text: "Browse all public events", included: true },
      { text: "Purchase up to 5 tickets/month", included: true },
      { text: "Email ticket delivery", included: true },
      { text: "Basic event reminders", included: true },
      { text: "Organizer dashboard", included: false },
      { text: "Priority customer support", included: false },
      { text: "Custom event branding", included: false },
      { text: "Analytics & reporting", included: false },
    ],
    cta: "Get started free",
    ctaLink: "/register",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    monthlyPrice: 9900,
    yearlyPrice: 89000,
    description: "For active attendees and budding event organizers.",
    color: "#ff7f11",
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Unlimited ticket purchases", included: true },
      { text: "Organizer dashboard", included: true },
      { text: "Create up to 10 events/month", included: true },
      { text: "Priority customer support", included: true },
      { text: "Custom event branding", included: false },
      { text: "Analytics & reporting", included: false },
      { text: "API access", included: false },
    ],
    cta: "Start Pro",
    ctaLink: "/register",
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    icon: Building2,
    monthlyPrice: 29900,
    yearlyPrice: 269000,
    description: "For professional organizers and growing companies.",
    color: "#ff3f00",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited event creation", included: true },
      { text: "Custom event branding", included: true },
      { text: "Advanced analytics & reporting", included: true },
      { text: "API access", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "White-label ticketing", included: true },
      { text: "SLA support", included: true },
    ],
    cta: "Contact sales",
    ctaLink: "/contact",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
  },
  {
    q: "Is there a free trial for Pro or Business?",
    a: "Absolutely. Every new account gets a 14-day free trial of the Pro plan — no credit card required.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major cards, bank transfers, and Paystack. Nigerian bank cards are fully supported.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. If you're not satisfied within the first 30 days, we'll issue a full refund — no questions asked.",
  },
];

const fmt = (n) => (n === 0 ? "Free" : `₦${Number(n).toLocaleString("en-NG")}`);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffcff] font-['Poppins',sans-serif]">
      <Navigation />

      {/* Hero */}
      <motion.section
        className="px-4 md:px-8 pt-14 pb-10 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.p
            className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Simple Pricing
          </motion.p>
          <motion.h1
            className="text-2xl md:text-4xl font-semibold text-neutral-800 leading-tight mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Plans for every stage
          </motion.h1>
          <motion.p
            className="text-sm text-neutral-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No hidden fees. No surprises. Cancel anytime.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            className="inline-flex items-center gap-3 bg-neutral-100 rounded-full p-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${!yearly ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-400"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${yearly ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-400"}`}
            >
              Yearly
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white rounded-full text-[9px] font-bold">
                –20%
              </span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Plans */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-screen-lg mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`relative bg-white rounded-2xl border p-6 flex flex-col ${plan.highlight ? "border-[#ff7f11] shadow-lg shadow-[#ff7f11]/10" : "border-neutral-100 shadow-sm"}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ff7f11] text-white text-[10px] font-bold uppercase tracking-wide rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${plan.color}18` }}>
                      <Icon size={18} style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-800">{plan.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 mb-5 leading-relaxed">{plan.description}</p>

                  <div className="mb-6">
                    <p className="text-3xl font-semibold text-neutral-800">
                      {fmt(price)}
                    </p>
                    {price > 0 && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        per {yearly ? "year" : "month"}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${f.included ? "bg-[#ff7f11]/10" : "bg-neutral-100"}`}>
                          {f.included
                            ? <Check size={9} style={{ color: plan.color }} strokeWidth={3} />
                            : <X size={9} className="text-neutral-300" strokeWidth={3} />}
                        </span>
                        <span className={`text-xs ${f.included ? "text-neutral-600" : "text-neutral-300"}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.ctaLink}>
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-colors cursor-pointer ${plan.highlight ? "bg-[#ff7f11] text-white hover:bg-[#e66f00]" : "border border-neutral-200 text-neutral-600 hover:border-[#ff7f11] hover:text-[#ff7f11]"}`}
                    >
                      {plan.cta}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-8 py-12 bg-white border-t border-neutral-100">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-xl font-semibold text-neutral-800">Common questions</h2>
          </motion.div>

          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="border border-neutral-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-neutral-700">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={15} className="text-neutral-300 shrink-0" />
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-4"
                  >
                    <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <motion.section
        className="px-4 md:px-8 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-lg mx-auto bg-[#ff7f11] rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Ready to get started?</h3>
            <p className="text-sm text-white/70">Join thousands of event-goers on Tixwav today.</p>
          </div>
          <Link to="/register">
            <motion.div
              whileTap={{ scale: 0.96 }}
              className="shrink-0 px-6 py-3 bg-white text-[#ff7f11] rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors cursor-pointer"
            >
              Create free account
            </motion.div>
          </Link>
        </div>
      </motion.section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Pricing;