import { Link } from "react-router-dom";
import * as motion from "motion/react-client";
import { ShieldCheck } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const SECTIONS = [
  {
    h: "Information we collect",
    p: "When you create an account we collect your name and email address. When you buy a ticket as a guest, we collect the name, email and (optionally) phone number you provide at checkout. Organizers also provide bank/payout details. We log basic technical data such as your device and pages visited to keep the service secure and reliable.",
  },
  {
    h: "How we use your information",
    p: "We use your information to create and secure your account, process ticket purchases, deliver your tickets and receipts by email, settle organizer payouts, prevent fraud, and improve Tixwav. We do not sell your personal data.",
  },
  {
    h: "Payments",
    p: "Card and bank payments are processed securely by Paystack. We never see or store your full card details — Paystack handles payment data under its own security standards (PCI-DSS).",
  },
  {
    h: "Third-party services",
    p: "We rely on trusted providers to run Tixwav: Paystack (payments & payouts), Cloudinary (event images & ticket PDFs), Brevo (transactional email such as ticket confirmations), and Google (optional sign-in). These providers only receive the data needed to perform their function.",
  },
  {
    h: "Cookies & sessions",
    p: "We use a secure, http-only cookie and in-session storage to keep you signed in. These are essential for the site to work and are not used for advertising.",
  },
  {
    h: "Data retention",
    p: "We keep your account and order history for as long as your account is active and as needed for legal, accounting and fraud-prevention purposes. You can request deletion of your account at any time.",
  },
  {
    h: "Your rights",
    p: "You can access, correct or delete your personal information, and you can object to certain processing. To exercise any of these rights, contact us and we'll respond promptly.",
  },
  {
    h: "Children",
    p: "Tixwav is not directed at children under 13, and we do not knowingly collect their personal information.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Seo
        title="Privacy Policy"
        description="How Tixwav collects, uses and protects your personal information."
        path="/privacy"
      />
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ff7f11]/10 flex items-center justify-center mb-4">
              <ShieldCheck size={22} className="text-[#ff7f11]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800">
              Privacy Policy
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              Last updated {new Date().getFullYear()}. This explains what we
              collect and how we use it.
            </p>
          </motion.div>

          <div className="space-y-7">
            {SECTIONS.map((s) => (
              <section key={s.h}>
                <h2 className="text-sm font-semibold text-neutral-800 mb-1.5">
                  {s.h}
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.p}</p>
              </section>
            ))}

            <section>
              <h2 className="text-sm font-semibold text-neutral-800 mb-1.5">
                Contact
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Questions about this policy or your data? Reach us through the{" "}
                <Link to="/contact" className="text-[#ff7f11] hover:underline">
                  Contact page
                </Link>{" "}
                or at{" "}
                <a
                  href="mailto:tixwav@gmail.com"
                  className="text-[#ff7f11] hover:underline"
                >
                  tixwav@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PrivacyPolicy;
