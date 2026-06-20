import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as motion from "motion/react-client";
import {
  Calendar,
  MapPin,
  Clock,
  Minus,
  Plus,
  Ticket,
  ArrowLeft,
  Globe,
  Heart,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";
import {
  fetchEvent,
  selectCurrentEvent,
  selectCurrentLoading,
} from "@/store/slices/eventSlice";
import {
  initiateOrder,
  selectIsInitiating,
} from "@/store/slices/orderSlice";
import {
  getSavedEvents,
  toggleSavedEvent,
  selectSavedIds,
} from "@/store/slices/userSlice";
import { selectIsAuthenticated, selectUser } from "@/store/slices/authSlice";
import { formatPrice, formatDate } from "@/lib/format";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='480'><rect width='100%' height='100%' fill='%23beb7a4'/></svg>`,
  );

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const event = useSelector(selectCurrentEvent);
  const loading = useSelector(selectCurrentLoading);
  const isInitiating = useSelector(selectIsInitiating);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const savedIds = useSelector(selectSavedIds);

  const [qty, setQty] = useState({}); // tierId -> quantity
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  // Load the user's saved events so we can show the correct heart state
  useEffect(() => {
    if (isAuthenticated) dispatch(getSavedEvents());
  }, [dispatch, isAuthenticated]);

  const isSaved = event ? savedIds.includes(event._id) : false;

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.info("Log in to save events.");
      navigate("/login", { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    dispatch(toggleSavedEvent(event._id))
      .unwrap()
      .then((res) => toast.success(res.saved ? "Saved to your list" : "Removed from saved"))
      .catch(() => toast.error("Could not update saved events."));
  };

  const setTierQty = (tierId, delta, max) => {
    setQty((prev) => {
      const next = Math.max(0, Math.min((prev[tierId] || 0) + delta, Math.min(max, 10)));
      return { ...prev, [tierId]: next };
    });
  };

  const items = Object.entries(qty)
    .filter(([, q]) => q > 0)
    .map(([tierId, quantity]) => ({ tierId, quantity }));

  const subtotal = (event?.ticketTiers || []).reduce((sum, t) => {
    return sum + (qty[t._id] || 0) * t.price;
  }, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = async () => {
    if (totalQty === 0) {
      toast.warning("Select at least one ticket.");
      return;
    }
    const payload = { eventId: event._id, items };
    if (!isAuthenticated) {
      if (!guest.name || !guest.email) {
        toast.warning("Enter your name and email to continue.");
        return;
      }
      payload.guestName = guest.name;
      payload.guestEmail = guest.email;
      payload.guestPhone = guest.phone;
    }

    try {
      const res = await dispatch(initiateOrder(payload)).unwrap();
      if (res.payment?.authorizationUrl) {
        // Paid order — hand off to Paystack
        window.location.href = res.payment.authorizationUrl;
      } else {
        // Free order — straight to confirmation
        toast.success("Order confirmed! Your tickets are on the way.");
        navigate(`/orders/${res.order._id}`);
      }
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Checkout failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="h-[60vh] flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <Navigation />
        <div className="max-w-xl mx-auto text-center py-28 px-4">
          <h1 className="text-xl font-semibold text-neutral-700">Event not found</h1>
          <p className="text-sm text-neutral-400 mt-2">
            It may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate("/discover")}
            className="mt-6 bg-[#ff7f11] text-white px-5 py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00]"
          >
            Browse events
          </button>
        </div>
      </div>
    );
  }

  const soldOut =
    event.ticketTiers?.length > 0 &&
    event.ticketTiers.every((t) => t.quantity - t.sold <= 0);
  const ended = event.endDate && new Date(event.endDate) < new Date();

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Seo
        title={event.title}
        description={(event.description || "").slice(0, 155)}
        path={`/events/${event.slug || event._id}`}
        image={event.image}
      />
      <Navigation />

      <main className="flex-1 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#ff7f11] mb-4 transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl overflow-hidden bg-neutral-100 mb-6 lg:w-fit"
              >
                <img
                  src={event.image || FALLBACK_IMG}
                  alt={event.title}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  className="w-full h-auto block lg:w-auto lg:max-h-[560px]"
                />
                {event.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-xs font-medium">
                    {event.category}
                  </span>
                )}
                {ended && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-neutral-900/80 text-white text-xs font-semibold">
                    Ended
                  </span>
                )}
              </motion.div>

              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800">
                  {event.title}
                </h1>
                <motion.button
                  onClick={handleSave}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isSaved ? "Remove from saved" : "Save event"}
                  className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                    isSaved
                      ? "border-[#ff7f11] bg-[#ff7f11]/10 text-[#ff7f11]"
                      : "border-neutral-200 text-neutral-400 hover:border-[#ff7f11] hover:text-[#ff7f11]"
                  }`}
                >
                  <Heart size={18} className={isSaved ? "fill-[#ff7f11]" : ""} />
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm text-neutral-500">
                <span className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#ff7f11]" />
                  {formatDate(event.startDate, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={15} className="text-[#ff7f11]" />
                  {new Date(event.startDate).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="flex items-start gap-2">
                  {event.isOnline ? (
                    <>
                      <Globe size={15} className="text-[#ff7f11]" /> Online event
                    </>
                  ) : (
                    <>
                      <MapPin size={15} className="text-[#ff7f11] mt-0.5 shrink-0" />
                      <span>
                        {[
                          event.venue?.name,
                          event.venue?.address,
                          event.venue?.state,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Venue TBA"}
                      </span>
                    </>
                  )}
                </span>
              </div>

              {(event.organizerName || event.organizer) && (
                (() => {
                  const hostName =
                    event.organizerName ||
                    event.organizer?.organizerInfo?.companyName ||
                    `${event.organizer?.firstName || ""} ${event.organizer?.lastName || ""}`.trim() ||
                    "Organizer";
                  return (
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                      <div className="w-10 h-10 rounded-full bg-[#ff7f11]/10 flex items-center justify-center text-[#ff7f11] font-semibold">
                        {hostName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Organized by</p>
                        <p className="text-sm font-medium text-neutral-700">{hostName}</p>
                      </div>
                    </div>
                  );
                })()
              )}

              <h2 className="text-sm font-semibold text-neutral-700 mb-2">
                About this event
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>

              {event.tags?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mt-5">
                  {event.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-neutral-100 rounded-full text-[11px] text-neutral-500"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: ticket picker */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white border border-neutral-100 rounded-2xl shadow-sm p-5">
                <h2 className="text-sm font-semibold text-neutral-800 mb-1 flex items-center gap-2">
                  <Ticket size={16} className="text-[#ff7f11]" /> Get tickets
                </h2>
                <p className="text-xs text-neutral-400 mb-4">
                  Secure checkout — pay with card, bank or USSD.
                </p>

                {ended ? (
                  <div className="text-center py-8 text-sm font-medium text-neutral-500">
                    This event has ended.
                  </div>
                ) : event.status !== "published" ? (
                  <div className="text-center py-8 text-sm text-neutral-400">
                    Tickets are not on sale for this event.
                  </div>
                ) : soldOut ? (
                  <div className="text-center py-8 text-sm font-medium text-red-500">
                    Sold out
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {event.ticketTiers.map((tier) => {
                        const available = tier.quantity - tier.sold;
                        return (
                          <div
                            key={tier._id}
                            className="border border-neutral-200 rounded-xl p-3.5"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <p className="text-sm font-medium text-neutral-800">
                                  {tier.name}
                                </p>
                                <p className="text-sm font-semibold text-[#ff7f11]">
                                  {formatPrice(tier.price)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setTierQty(tier._id, -1, available)}
                                  disabled={!qty[tier._id]}
                                  className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 disabled:opacity-40 hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="w-5 text-center text-sm font-medium">
                                  {qty[tier._id] || 0}
                                </span>
                                <button
                                  onClick={() => setTierQty(tier._id, 1, available)}
                                  disabled={available <= 0}
                                  className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 disabled:opacity-40 hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                            {tier.description && (
                              <p className="text-[11px] text-neutral-400">
                                {tier.description}
                              </p>
                            )}
                            <p className="text-[11px] text-neutral-400 mt-1">
                              {available > 0 ? `${available} left` : "Sold out"}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {!isAuthenticated && totalQty > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                          Your details
                        </p>
                        <input
                          placeholder="Full name"
                          value={guest.name}
                          onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-[#ff7f11]"
                        />
                        <input
                          placeholder="Email (tickets sent here)"
                          type="email"
                          value={guest.email}
                          onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-[#ff7f11]"
                        />
                        <input
                          placeholder="Phone (optional)"
                          value={guest.phone}
                          onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-[#ff7f11]"
                        />
                      </div>
                    )}

                    <div className="border-t border-neutral-100 mt-4 pt-4">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-neutral-500">Subtotal</span>
                        <span className="font-semibold text-neutral-800">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCheckout}
                        disabled={isInitiating || totalQty === 0}
                        className="w-full bg-[#ff7f11] text-white py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isInitiating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing…
                          </>
                        ) : subtotal === 0 && totalQty > 0 ? (
                          "Get free tickets"
                        ) : (
                          `Checkout · ${formatPrice(subtotal)}`
                        )}
                      </motion.button>
                      {user && (
                        <p className="text-[11px] text-neutral-400 text-center mt-2">
                          Tickets sent to {user.email}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default EventDetail;
