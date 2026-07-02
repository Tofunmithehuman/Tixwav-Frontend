import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as motion from "motion/react-client";
import {
  Ticket as TicketIcon,
  Calendar,
  MapPin,
  Download,
  Trash2,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  getMyOrders,
  removeMyTicket,
  selectOrders,
  selectIsOrdersLoading,
} from "@/store/slices/userSlice";
import { downloadTicketPdf } from "@/lib/downloadTicket";
import { formatDate } from "@/lib/format";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  used: "bg-blue-100 text-blue-600",
  cancelled: "bg-red-100 text-red-600",
  refunded: "bg-neutral-100 text-neutral-500",
  ended: "bg-neutral-100 text-neutral-500",
};

// A ticket for an event that's over (and was never used) shows as "Ended"
// instead of a misleading green "Active".
const displayStatus = (t) => {
  if (t.status === "active") {
    const end = t.event?.endDate || t.event?.startDate;
    if (end && new Date(end).getTime() < Date.now()) return "ended";
  }
  return t.status;
};

const MyTickets = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectIsOrdersLoading);
  const [toRemove, setToRemove] = useState(null); // ticketCode pending removal
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    dispatch(getMyOrders({ limit: 100 }));
  }, [dispatch]);

  // Flatten every (non-removed) ticket and attach its event
  const tickets = orders.flatMap((o) =>
    (o.tickets || [])
      .filter((t) => t.status !== "cancelled")
      .map((t) => ({ ...t, event: o.event })),
  );

  const download = (code) =>
    downloadTicketPdf(code).catch(() =>
      toast.error("Your ticket PDF is still being prepared — try again shortly."),
    );

  const confirmRemove = () => {
    if (!toRemove) return;
    setRemoving(true);
    dispatch(removeMyTicket(toRemove))
      .unwrap()
      .then(() => toast.success("Ticket removed."))
      .catch((err) => toast.error(err || "Could not remove ticket."))
      .finally(() => {
        setRemoving(false);
        setToRemove(null);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <TicketIcon size={22} className="text-[#ff7f11]" />
            <h1 className="text-2xl font-semibold text-neutral-800">My tickets</h1>
          </div>
          <p className="text-sm text-neutral-400 mb-6">
            All your tickets in one place — download or remove them.
          </p>

          {loading && tickets.length === 0 ? (
            <div className="h-[30vh] flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white border border-neutral-100 rounded-2xl p-12 text-center">
              <TicketIcon size={28} className="text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">You don't have any tickets yet.</p>
              <Link
                to="/discover"
                className="inline-block mt-4 bg-[#ff7f11] text-white px-5 py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00]"
              >
                Find events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tickets.map((t, i) => (
                <motion.div
                  key={t._id || t.ticketCode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 8) * 0.04 }}
                  className="bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col"
                >
                  <div className="flex items-start gap-3">
                    {t.qrCode ? (
                      <img
                        src={t.qrCode}
                        alt="QR"
                        className="w-16 h-16 rounded-lg bg-white shrink-0 border border-neutral-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-[#ff7f11]/10 flex items-center justify-center shrink-0">
                        <TicketIcon size={20} className="text-[#ff7f11]" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/events/${t.event?.slug || t.event?._id || ""}`}
                        className="text-sm font-semibold text-neutral-800 hover:text-[#ff7f11] line-clamp-1"
                      >
                        {t.event?.title || "Event"}
                      </Link>
                      <p className="text-sm font-semibold text-[#ff7f11] tracking-wide mt-0.5">
                        {t.ticketCode}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusStyles[displayStatus(t)] || "bg-neutral-100 text-neutral-500"}`}
                      >
                        {t.tierName} · {displayStatus(t)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-3 text-[11px] text-neutral-400">
                    {t.event?.startDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-[#ff7f11]" />
                        {formatDate(t.event.startDate, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-[#ff7f11]" />
                      {t.event?.isOnline ? "Online" : t.event?.venue?.city || "TBA"}
                    </span>
                  </div>

                  {/* Actions — wrap on small screens so nothing overflows */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-neutral-100">
                    <button
                      onClick={() => download(t.ticketCode)}
                      className="flex-1 min-w-30 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#ff7f11] rounded-lg px-3 py-2 hover:bg-[#e66f00] transition-colors"
                    >
                      <Download size={13} /> Download
                    </button>
                    <button
                      onClick={() => setToRemove(t.ticketCode)}
                      className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-500 border border-neutral-200 rounded-lg px-3 py-2 hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ConfirmDialog
        open={!!toRemove}
        danger
        title="Remove this ticket?"
        message="This removes the ticket from your account and can't be undone."
        confirmLabel="Remove"
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => !removing && setToRemove(null)}
      />
    </div>
  );
};

export default MyTickets;
