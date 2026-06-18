import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as motion from "motion/react-client";
import {
  Plus,
  ScanLine,
  Wallet,
  TrendingUp,
  Ticket,
  CalendarDays,
  Pencil,
  Trash2,
  Users,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import { selectUser } from "@/store/slices/authSlice";
import {
  fetchMyEvents,
  publishEvent,
  deleteEvent,
  selectMyEvents,
  selectMyEventsPagination,
} from "@/store/slices/eventSlice";
import {
  fetchOrgOverview,
  fetchPayout,
  selectOrgOverview,
  selectPayoutAccount,
} from "@/store/slices/organizerSlice";
import { formatNaira, formatDate } from "@/lib/format";

const statusStyles = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-neutral-100 text-neutral-500",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-600",
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-neutral-100 rounded-2xl p-4"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-neutral-400">{label}</span>
      <Icon size={16} className={accent || "text-[#ff7f11]"} />
    </div>
    <p className="text-xl font-semibold text-neutral-800">{value}</p>
  </motion.div>
);

const OrganizerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const events = useSelector(selectMyEvents);
  const pagination = useSelector(selectMyEventsPagination);
  const overview = useSelector(selectOrgOverview);
  const payout = useSelector(selectPayoutAccount);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null); // event pending deletion
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchOrgOverview());
    dispatch(fetchPayout());
  }, [dispatch]);

  // Debounce the event search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    dispatch(fetchMyEvents({ search: debouncedQ || undefined, page, limit: 10 }));
  }, [dispatch, debouncedQ, page]);

  const onSearch = (v) => {
    setQ(v);
    setPage(1);
  };

  const handlePublish = (ev) => {
    const action = ev.status === "published" ? "unpublish" : "publish";
    dispatch(publishEvent({ id: ev._id, action }))
      .unwrap()
      .then((d) => toast.success(`Event ${d.event.status}.`))
      .catch((err) => {
        if (err?.code === "PAYOUT_REQUIRED") {
          toast.warning(err.message);
          navigate("/organizer/payout");
        } else {
          toast.error(err?.message || "Could not update event.");
        }
      });
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setDeleting(true);
    dispatch(deleteEvent(toDelete._id))
      .unwrap()
      .then(() => toast.success("Event deleted."))
      .catch((err) => toast.error(err || "Could not delete event."))
      .finally(() => {
        setDeleting(false);
        setToDelete(null);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-800">
                Organizer dashboard
              </h1>
              <p className="text-sm text-neutral-400">
                {user?.organizerInfo?.companyName || `${user?.firstName}'s events`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/organizer/scan"
                className="flex items-center gap-1.5 border border-neutral-200 text-neutral-600 px-3.5 py-2 rounded-xs text-sm font-medium hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors"
              >
                <ScanLine size={15} /> Scan
              </Link>
              <Link
                to="/organizer/payout"
                className="flex items-center gap-1.5 border border-neutral-200 text-neutral-600 px-3.5 py-2 rounded-xs text-sm font-medium hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors"
              >
                <Wallet size={15} /> Payout
              </Link>
              <Link
                to="/organizer/events/new"
                className="flex items-center gap-1.5 bg-[#ff7f11] text-white px-3.5 py-2 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition-colors"
              >
                <Plus size={15} /> Create event
              </Link>
            </div>
          </div>

          {/* Payout reminder */}
          {payout === null && (
            <Link to="/organizer/payout">
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 hover:bg-amber-100/60 transition-colors">
                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800">
                  Add your payout bank details to publish paid events and receive your 90%.
                </p>
              </div>
            </Link>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard
              icon={Wallet}
              label="Your earnings (90%)"
              value={formatNaira(overview?.earnings)}
            />
            <StatCard
              icon={TrendingUp}
              label="Gross sales"
              value={formatNaira(overview?.grossRevenue)}
              accent="text-emerald-500"
            />
            <StatCard
              icon={Ticket}
              label="Tickets sold"
              value={overview?.ticketsSold ?? 0}
              accent="text-blue-500"
            />
            <StatCard
              icon={CalendarDays}
              label="Events"
              value={`${overview?.publishedEvents ?? 0}/${overview?.totalEvents ?? 0}`}
              accent="text-purple-500"
            />
          </div>

          {/* My events */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-semibold text-neutral-700">Your events</h2>
            <div className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11] rounded-lg px-3 bg-white">
              <Search size={14} className="text-neutral-400 shrink-0" />
              <input
                value={q}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search your events"
                className="py-2 px-2 text-base focus:outline-none bg-transparent w-40 sm:w-56 min-w-0"
              />
            </div>
          </div>
          {events.length === 0 ? (
            debouncedQ ? (
              <div className="bg-white border border-neutral-100 rounded-2xl p-12 text-center text-sm text-neutral-400">
                No events match “{debouncedQ}”.
              </div>
            ) : (
              <div className="bg-white border border-neutral-100 rounded-2xl p-12 text-center">
                <CalendarDays size={28} className="text-neutral-300 mx-auto mb-3" />
                <p className="text-sm text-neutral-500">You haven't created any events yet.</p>
                <Link
                  to="/organizer/events/new"
                  className="inline-block mt-4 bg-[#ff7f11] text-white px-5 py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00]"
                >
                  Create your first event
                </Link>
              </div>
            )
          ) : (
            <>
            <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-neutral-400 border-b border-neutral-100">
                      <th className="px-4 py-3 font-medium">Event</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Sold</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr
                        key={ev._id}
                        className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                      >
                        <td className="px-4 py-3">
                          <Link
                            to={`/events/${ev.slug || ev._id}`}
                            className="font-medium text-neutral-700 hover:text-[#ff7f11] line-clamp-1"
                          >
                            {ev.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusStyles[ev.status] || "bg-neutral-100 text-neutral-500"}`}
                          >
                            {ev.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                          {formatDate(ev.startDate)}
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {ev.totalSold ?? 0}/{ev.totalTickets ?? 0}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {ev.status !== "cancelled" && ev.status !== "completed" && (
                              <button
                                title={ev.status === "published" ? "Unpublish" : "Publish"}
                                onClick={() => handlePublish(ev)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-[#ff7f11] hover:bg-neutral-100"
                              >
                                {ev.status === "published" ? (
                                  <EyeOff size={15} />
                                ) : (
                                  <Eye size={15} />
                                )}
                              </button>
                            )}
                            <Link
                              to={`/organizer/events/${ev._id}/tickets`}
                              title="Attendees"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-neutral-100"
                            >
                              <Users size={15} />
                            </Link>
                            <Link
                              to={`/organizer/events/${ev._id}/edit`}
                              title="Edit"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                            >
                              <Pencil size={15} />
                            </Link>
                            <button
                              title="Delete"
                              onClick={() => setToDelete(ev)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination page={page} pages={pagination?.pages} total={pagination?.total} onPage={setPage} />
            </>
          )}
        </div>
      </main>
      <Footer />
      <ConfirmDialog
        open={!!toDelete}
        danger
        title="Delete event?"
        message={
          toDelete
            ? `"${toDelete.title}" and its data will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setToDelete(null)}
      />
    </div>
  );
};

export default OrganizerDashboard;
