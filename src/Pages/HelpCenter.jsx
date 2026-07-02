import { useState } from "react";
import { Link } from "react-router-dom";
import * as motion from "motion/react-client";
import { LifeBuoy, ChevronDown, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const FAQS = [
  {
    q: "How do I buy a ticket?",
    a: "Open any event, pick your ticket tier and quantity, then check out. You can pay with card, bank transfer or USSD through Paystack. Your tickets are emailed to you and saved to your account.",
  },
  {
    q: "Where are my tickets after I pay?",
    a: "Right after payment we email your tickets (with a QR code and a calendar invite). Logged-in users also find them under ‘My Tickets’ and on their profile. Guests can reopen them from the link in the email.",
  },
  {
    q: "I didn't get my ticket email, what do I do?",
    a: "Check your spam folder first. Tickets are generated within a minute of payment. If it still hasn't arrived, open the order link from checkout (or your profile) to download the ticket, or contact us.",
  },
  {
    q: "Can I get a refund?",
    a: "All ticket sales are final, so we don't offer refunds for change of mind or being unable to attend. You may be eligible if an event is cancelled, or if you were charged twice or in error — see our Refund Policy for the full details and how to request one.",
    link: { to: "/refund-policy", label: "Read our Refund Policy" },
  },
  {
    q: "How do I become an organizer?",
    a: "Create an account, then go to ‘Become an organizer’. Add your payout bank details and you can start creating events and selling tickets, you keep 90% of every sale, settled straight to your bank.",
  },
  {
    q: "How do payouts work for organizers?",
    a: "When a ticket sells, your 90% share is routed to your connected bank account via Paystack automatically — settlement typically lands the next business day after payment (weekend and holiday sales settle the next business day). The remaining 10% is the Tixwav platform fee.",
  },
  {
    q: "How do I verify tickets at the door?",
    a: "Organizers and admins can open the ‘Scan’ page to scan each attendee's QR code, or enter the ticket code by hand. Each ticket can only be used once.",
  },
];

const HelpCenter = () => {
  const [open, setOpen] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Seo
        title="Help Center"
        description="Answers to common questions about buying tickets, organizing events, payouts and verifying tickets on Tixwav."
        path="/help"
      />
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ff7f11]/10 flex items-center justify-center mx-auto mb-4">
              <LifeBuoy size={22} className="text-[#ff7f11]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800">
              Help Center
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              Answers to the most common questions about Tixwav.
            </p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="bg-white border border-neutral-100 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-neutral-800">
                      {f.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-neutral-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-5 pb-4"
                    >
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {f.a}
                      </p>
                      {f.link && (
                        <Link
                          to={f.link.to}
                          className="mt-2 inline-block text-sm font-medium text-[#ff7f11] hover:underline"
                        >
                          {f.link.label} →
                        </Link>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-[#ff7f11]/5 border border-[#ff7f11]/10 rounded-2xl p-6 text-center">
            <p className="text-sm font-medium text-neutral-700">
              Still need a hand?
            </p>
            <p className="text-xs text-neutral-400 mt-1 mb-4">
              We usually reply within a day.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#ff7f11] text-white px-5 py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition-colors"
            >
              <Mail size={15} /> Contact us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default HelpCenter;
