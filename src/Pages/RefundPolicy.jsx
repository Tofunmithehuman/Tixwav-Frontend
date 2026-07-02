import { Link } from "react-router-dom";
import * as motion from "motion/react-client";
import { Receipt } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const SECTIONS = [
  {
    h: "All sales are final",
    p: "Tickets purchased on Tixwav are non-refundable. Because your spot at an event is reserved the moment payment is completed, we do not offer refunds for change of mind, inability to attend, buying the wrong ticket, double-booking, or arriving late. Please review the event date, time, location and ticket type carefully before you pay.",
  },
  {
    h: "Event cancellation or postponement",
    p: "If an organizer cancels an event, affected ticket holders may be eligible for a refund of the ticket price. If an event is postponed or rescheduled, your existing ticket stays valid for the new date. Because organizers receive their share of each sale directly through our split-payment setup, refunds for cancelled events are funded by and arranged with the event organizer — Tixwav helps coordinate the process.",
  },
  {
    h: "Duplicate or incorrect charges",
    p: "If you were charged more than once for the same order, or charged in error, contact us with your order reference and we will verify and reverse any duplicate or erroneous charge.",
  },
  {
    h: "Unauthorized or fraudulent payments",
    p: "If you believe a charge was made without your authorization, contact us as soon as possible. We work with Paystack to investigate and resolve confirmed unauthorized transactions.",
  },
  {
    h: "How payments are handled",
    p: "When you buy a ticket, the payment is split at the moment of purchase: the event organizer receives their share (90%) directly and Tixwav retains a platform fee (10%). Paystack settles the organizer's share to their bank account, typically the next business day after a successful payment (weekend and public-holiday sales settle the next business day). This is why refunds, where they apply, are coordinated with the organizer who received the funds rather than issued unilaterally by Tixwav.",
  },
  {
    h: "How to request a refund",
    p: "For any of the eligible cases above, reach out through the Contact page or at tixwav@gmail.com with your order reference and the reason for your request. Where a refund is approved, it is returned to your original payment method via Paystack and may take a few business days to appear, depending on your bank.",
  },
];

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Seo
        title="Refund Policy"
        description="Tixwav's refund policy — ticket sales are final, with cover for cancelled events, duplicate charges and unauthorized payments."
        path="/refund-policy"
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
              <Receipt size={22} className="text-[#ff7f11]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800">
              Refund Policy
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              Last updated {new Date().getFullYear()}. Please read this before
              purchasing a ticket.
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
                Questions about this policy or a specific order? Reach us through
                the{" "}
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

export default RefundPolicy;
