import { useState } from "react";
import { toast } from "react-toastify";
import * as motion from "motion/react-client";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const SUPPORT_EMAIL = "tixwav@gmail.com";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warning("Please fill in your name, email and message.");
      return;
    }
    // No contact API — hand off to the user's email client with everything prefilled.
    const subject = encodeURIComponent(form.subject || `Support request from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    toast.success("Opening your email app to send the message…");
  };

  const cards = [
    { icon: Mail, label: "Email", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
    { icon: Phone, label: "Phone", value: "+234 703-263-8572", href: "tel:+2347032638572" },
    { icon: MapPin, label: "Location", value: "Lagos, Nigeria", href: null },
  ];

  const inputCls =
    "w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7f11] transition-colors";

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800">
              Contact us
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              Questions, feedback or help with an order — we'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {cards.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <div className="bg-white border border-neutral-100 rounded-2xl p-4 h-full hover:border-[#ff7f11]/30 transition-colors">
                  <Icon size={18} className="text-[#ff7f11] mb-2" />
                  <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-neutral-700 mt-0.5 break-words">
                    {value}
                  </p>
                </div>
              );
              return href ? (
                <a key={label} href={href}>
                  {inner}
                </a>
              ) : (
                <div key={label}>{inner}</div>
              );
            })}
          </div>

          <form
            onSubmit={submit}
            className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-600">NAME</label>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={`${inputCls} mt-1`}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600">EMAIL</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={`${inputCls} mt-1`}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600">SUBJECT</label>
              <input
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                className={`${inputCls} mt-1`}
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600">MESSAGE</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                className={`${inputCls} mt-1 resize-y`}
                placeholder="How can we help?"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff7f11] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
            >
              <Send size={15} /> Send message
            </motion.button>
          </form>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ContactUs;
