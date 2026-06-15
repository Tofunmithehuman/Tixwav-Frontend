import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as motion from "motion/react-client";
import { CheckCircle2, Calendar, MapPin, Download, Ticket } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { downloadTicketPdf } from "@/lib/downloadTicket";
import {
  fetchOrder,
  selectCheckoutOrder,
  selectIsLoadingOrder,
} from "@/store/slices/orderSlice";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { formatPrice, formatDate } from "@/lib/format";

const OrderConfirmation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectCheckoutOrder);
  const loading = useSelector(selectIsLoadingOrder);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // Guests need to confirm their email to view the order
  const [guestEmail, setGuestEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState(
    isAuthenticated ? "_" : "",
  );

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchOrder({ id }));
  }, [dispatch, id, isAuthenticated]);

  const loadAsGuest = (e) => {
    e.preventDefault();
    if (!guestEmail) return;
    setSubmittedEmail(guestEmail);
    dispatch(fetchOrder({ id, email: guestEmail }));
  };

  const downloadTicket = (ticketCode) => {
    downloadTicketPdf(ticketCode, isAuthenticated ? undefined : guestEmail).catch(
      () => alert("Your ticket PDF is still being prepared — try again in a moment."),
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Guest email gate */}
          {!isAuthenticated && !submittedEmail ? (
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 mt-6">
              <h1 className="text-lg font-semibold text-neutral-800 mb-1">
                View your tickets
              </h1>
              <p className="text-sm text-neutral-400 mb-4">
                Enter the email you used at checkout.
              </p>
              <form onSubmit={loadAsGuest} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="flex-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-[#ff7f11]"
                />
                <button className="bg-[#ff7f11] text-white px-5 rounded-xs text-sm font-semibold hover:bg-[#e66f00]">
                  View
                </button>
              </form>
            </div>
          ) : loading ? (
            <div className="h-[40vh] flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !order ? (
            <div className="text-center py-20">
              <p className="text-sm text-neutral-500">
                We couldn't find that order.
              </p>
              <Link
                to="/discover"
                className="inline-block mt-4 text-[#ff7f11] text-sm hover:underline"
              >
                Browse events
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Status banner */}
              <div className="text-center mb-6 mt-4">
                {order.status === "confirmed" ? (
                  <>
                    <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                    <h1 className="text-xl font-semibold text-neutral-800">
                      You're going! 🎉
                    </h1>
                    <p className="text-sm text-neutral-400 mt-1">
                      Order {order.orderRef} · tickets emailed to you
                    </p>
                  </>
                ) : order.status === "pending" ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                      <Ticket size={22} className="text-amber-500" />
                    </div>
                    <h1 className="text-xl font-semibold text-neutral-800">
                      Payment pending
                    </h1>
                    <p className="text-sm text-neutral-400 mt-1">
                      We'll confirm your tickets once payment completes.
                    </p>
                  </>
                ) : (
                  <h1 className="text-xl font-semibold text-neutral-800 capitalize">
                    Order {order.status}
                  </h1>
                )}
              </div>

              {/* Event card */}
              {order.event && (
                <div className="bg-white border border-neutral-100 rounded-2xl p-5 mb-5">
                  <p className="font-semibold text-neutral-800 mb-2">
                    {order.event.title}
                  </p>
                  <div className="flex flex-col gap-1.5 text-sm text-neutral-500">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#ff7f11]" />
                      {formatDate(order.event.startDate, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#ff7f11]" />
                      {order.event.venue?.city || "Online"}
                    </span>
                  </div>
                </div>
              )}

              {/* Tickets */}
              {order.tickets?.length > 0 && (
                <div className="bg-white border border-neutral-100 rounded-2xl p-5 mb-5">
                  <p className="text-sm font-semibold text-neutral-700 mb-3">
                    Your tickets ({order.tickets.length})
                  </p>
                  <div className="space-y-3">
                    {order.tickets.map((t) => (
                      <div
                        key={t._id || t.ticketCode}
                        className="flex items-center justify-between gap-3 border border-neutral-200 rounded-xl p-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {t.qrCode && (
                            <img
                              src={t.qrCode}
                              alt="QR"
                              className="w-12 h-12 rounded bg-white shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#ff7f11] tracking-wide">
                              {t.ticketCode}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {t.tierName} · {t.status}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadTicket(t.ticketCode)}
                          className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 rounded-lg px-3 py-2 hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors shrink-0"
                        >
                          <Download size={13} /> PDF
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-white border border-neutral-100 rounded-2xl p-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-neutral-700">{formatPrice(order.subtotal)}</span>
                </div>
                {order.fees > 0 && (
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-neutral-500">Service fee</span>
                    <span className="text-neutral-700">{formatPrice(order.fees)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold border-t border-neutral-100 pt-2 mt-2">
                  <span className="text-neutral-800">Total</span>
                  <span className="text-neutral-800">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="text-center mt-6">
                <Link
                  to="/discover"
                  className="text-sm text-[#ff7f11] hover:underline"
                >
                  Discover more events
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
