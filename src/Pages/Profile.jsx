import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import * as motion from "motion/react-client";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Ticket,
  Calendar,
  Heart,
  Edit3,
  Check,
  X,
  ChevronRight,
  Clock,
  Star,
  Key,
  Bell,
  Shield,
  Trash2,
  Download,
  LogOut,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Upload,
} from "lucide-react";

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0 }}
        className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 pointer-events-auto whitespace-nowrap ${
          t.type === "success"
            ? "bg-emerald-500 text-white"
            : t.type === "error"
              ? "bg-red-500 text-white"
              : "bg-neutral-800 text-white"
        }`}
      >
        {t.type === "success" ? (
          <CheckCircle size={14} />
        ) : t.type === "error" ? (
          <XCircle size={14} />
        ) : (
          <Bell size={14} />
        )}
        {t.message}
      </motion.div>
    ))}
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-neutral-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// ── Toggle ────────────────────────────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative rounded-full transition-colors shrink-0`}
    style={{
      width: "40px",
      height: "22px",
      backgroundColor: value ? "#ff7f11" : "#e5e5e5",
    }}
  >
    <motion.div
      className="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"
      animate={{ left: value ? "20px" : "3px" }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    />
  </button>
);

// ── Main Profile ──────────────────────────────────────────────────────────────
const Profile = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  // ── Profile Data ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    firstName: "Amara",
    lastName: "Osei",
    email: "amara.osei@email.com",
    phone: "+234 812 345 6789",
    location: "Lagos, Nigeria",
    bio: "Event enthusiast and community builder. Always looking for the next great experience.",
  });
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({ ...form });

  const handleSave = () => {
    setForm({ ...draft });
    setEditMode(false);
    showToast("Profile updated!", "success");
  };
  const handleCancel = () => {
    setDraft({ ...form });
    setEditMode(false);
  };

  // ── Tickets ─────────────────────────────────────────────────────────────────
  const [tickets, setTickets] = useState([
    {
      id: "TXW-001",
      event: "React Conference 2026",
      date: "May 10, 2026",
      seat: "A-14",
      status: "upcoming",
      price: 25000,
    },
    {
      id: "TXW-002",
      event: "Design Systems Meetup",
      date: "Apr 28, 2026",
      seat: "General",
      status: "upcoming",
      price: 5000,
    },
    {
      id: "TXW-003",
      event: "JavaScript Masterclass",
      date: "Apr 22, 2026",
      seat: "B-07",
      status: "attended",
      price: 20000,
    },
    {
      id: "TXW-004",
      event: "Web Performance Workshop",
      date: "Mar 15, 2026",
      seat: "C-02",
      status: "attended",
      price: 15000,
    },
  ]);
  const [ticketFilter, setTicketFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const filteredTickets =
    ticketFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === ticketFilter);

  // ── Saved Events ────────────────────────────────────────────────────────────
  const [saved, setSaved] = useState([
    {
      id: 1,
      name: "AI & Machine Learning Summit",
      date: "Jun 1, 2026",
      price: 25000,
      category: "Tech",
    },
    {
      id: 2,
      name: "UX Design Bootcamp",
      date: "Jun 14, 2026",
      price: 40000,
      category: "Design",
    },
    {
      id: 3,
      name: "Startup Weekend Lagos",
      date: "Jul 4, 2026",
      price: 0,
      category: "Business",
    },
  ]);

  const removeSaved = (id) => {
    setSaved((p) => p.filter((e) => e.id !== id));
    showToast("Event removed from saved.", "info");
  };

  // ── Notifications ───────────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    eventReminders: true,
    newEvents: true,
    ticketUpdates: true,
    newsletter: false,
    smsAlerts: false,
  });

  // ── Password Change ─────────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      showToast("Please fill all fields.", "error");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      showToast("Passwords don't match.", "error");
      return;
    }
    if (passwords.newPass.length < 8) {
      showToast("Password must be 8+ characters.", "error");
      return;
    }
    setPasswords({ current: "", newPass: "", confirm: "" });
    setModal(null);
    showToast("Password changed successfully!", "success");
  };

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = [
    {
      label: "Events Attended",
      value: tickets.filter((t) => t.status === "attended").length,
      icon: Calendar,
    },
    { label: "Tickets Bought", value: tickets.length, icon: Ticket },
    { label: "Saved Events", value: saved.length, icon: Heart },
    {
      label: "Total Spent",
      value: `₦${tickets.reduce((a, t) => a + t.price, 0).toLocaleString("en-NG")}`,
      icon: Star,
    },
  ];

  const inp =
    "w-full border border-neutral-200 focus:border-[#ff7f11ff] rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none transition-colors bg-white";

  return (
    <div className="font-['Poppins',sans-serif]">
      <Navigation />
      <div className="min-h-screen bg-[#fffffcff] pb-16">
        {/* Banner */}
        <div
          className="relative h-36 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #ff7f1108 0%, #beb7a415 50%, #ff3f0008 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 85%, #ff7f1120 0%, transparent 45%), radial-gradient(circle at 85% 15%, #ff3f0015 0%, transparent 45%)",
            }}
          />
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          {/* Header Row */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Avatar */}
            <div className="relative w-fit">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#ff7f11ff] to-[#ff3f00] flex items-center justify-center text-white text-3xl font-semibold shadow-lg border-4 border-white select-none">
                {form.firstName[0]}
                {form.lastName[0]}
              </div>
              <motion.button
                onClick={() => showToast("Photo upload coming soon!", "info")}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm hover:border-[#ff7f11ff] transition-colors"
              >
                <Camera size={12} className="text-neutral-500" />
              </motion.button>
            </div>

            <div className="flex-1 pb-1">
              <h1 className="text-xl font-semibold text-neutral-800">
                {form.firstName} {form.lastName}
              </h1>
              <p className="text-sm text-neutral-400 flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-[#ff7f11ff]" />{" "}
                {form.location}
              </p>
            </div>

            <div className="sm:pb-1 flex gap-2">
              {!editMode ? (
                <>
                  <motion.button
                    onClick={() => setEditMode(true)}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-600 hover:border-[#ff7f11ff] hover:text-[#ff7f11ff] transition-all"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      showToast("Downloading your data...", "info")
                    }
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-500 hover:bg-neutral-50 transition-all"
                  >
                    <Download size={14} />
                  </motion.button>
                </>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleSave}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff7f11ff] text-white text-sm font-medium hover:bg-[#e66f00] transition-colors"
                  >
                    <Check size={14} /> Save
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-500 hover:bg-neutral-50 transition-colors"
                  >
                    <X size={14} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ─ LEFT ─ */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Stats */}
              <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm">
                <h2 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Overview
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.div
                        key={i}
                        className="p-3 bg-neutral-50 rounded-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.07 + 0.2 }}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#ff7f11ff]/10 flex items-center justify-center mb-2">
                          <Icon size={13} className="text-[#ff7f11ff]" />
                        </div>
                        <p className="text-base font-bold text-neutral-800">
                          {s.value}
                        </p>
                        <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                          {s.label}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm">
                <h2 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Personal Info
                </h2>
                {editMode ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-semibold uppercase">
                          First
                        </label>
                        <input
                          className={`mt-1 ${inp}`}
                          value={draft.firstName}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              firstName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-semibold uppercase">
                          Last
                        </label>
                        <input
                          className={`mt-1 ${inp}`}
                          value={draft.lastName}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              lastName: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    {[
                      ["Email", "email", "email"],
                      ["Phone", "phone", "tel"],
                      ["Location", "location", "text"],
                    ].map(([label, key, type]) => (
                      <div key={key}>
                        <label className="text-[10px] text-neutral-400 font-semibold uppercase">
                          {label}
                        </label>
                        <input
                          type={type}
                          className={`mt-1 ${inp}`}
                          value={draft[key]}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, [key]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] text-neutral-400 font-semibold uppercase">
                        Bio
                      </label>
                      <textarea
                        className={`mt-1 ${inp} resize-none`}
                        rows={3}
                        value={draft.bio}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, bio: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { icon: Mail, value: form.email },
                      { icon: Phone, value: form.phone },
                      { icon: MapPin, value: form.location },
                    ].map(({ icon: Icon, value }, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Icon
                          size={13}
                          className="text-[#ff7f11ff] mt-0.5 shrink-0"
                        />
                        <span className="text-sm text-neutral-600 break-all">
                          {value}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-neutral-50">
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {form.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm">
                <h2 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Notifications
                </h2>
                <div className="space-y-3.5">
                  {[
                    { key: "eventReminders", label: "Event Reminders" },
                    { key: "newEvents", label: "New Events Near Me" },
                    { key: "ticketUpdates", label: "Ticket Updates" },
                    { key: "newsletter", label: "Newsletter" },
                    { key: "smsAlerts", label: "SMS Alerts" },
                  ].map((n) => (
                    <div
                      key={n.key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-neutral-600">
                        {n.label}
                      </span>
                      <Toggle
                        value={notifs[n.key]}
                        onChange={(v) => {
                          setNotifs((p) => ({ ...p, [n.key]: v }));
                          showToast(
                            `${n.label} ${v ? "enabled" : "disabled"}.`,
                            "info",
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ─ RIGHT ─ */}
            <motion.div
              className="lg:col-span-2 space-y-5"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Tickets / Saved Tabs */}
              <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b border-neutral-100 px-6">
                  {[
                    { id: "tickets", label: "My Tickets", icon: Ticket },
                    { id: "saved", label: "Saved Events", icon: Heart },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-1 py-4 mr-6 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-[#ff7f11ff]" : "text-neutral-400 hover:text-neutral-600"}`}
                      >
                        <Icon size={14} /> {tab.label}
                        {activeTab === tab.id && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff7f11ff] rounded-full"
                            layoutId="tabLine"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-5">
                  {/* Tickets */}
                  {activeTab === "tickets" && (
                    <motion.div
                      key="tickets"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Filter pills */}
                      <div className="flex gap-2">
                        {["all", "upcoming", "attended"].map((f) => (
                          <button
                            key={f}
                            onClick={() => setTicketFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${ticketFilter === f ? "bg-[#ff7f11ff] text-white" : "border border-neutral-200 text-neutral-500 hover:border-[#ff7f11ff] hover:text-[#ff7f11ff]"}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {filteredTickets.map((t, i) => (
                          <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center gap-4 p-4 border border-neutral-100 rounded-xl hover:border-[#ff7f11ff]/25 hover:shadow-sm transition-all group cursor-pointer"
                            onClick={() => {
                              setSelectedTicket(t);
                              setModal("ticket");
                            }}
                          >
                            <div
                              className={`w-1 h-14 rounded-full shrink-0 ${t.status === "upcoming" ? "bg-[#ff7f11ff]" : "bg-neutral-300"}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-neutral-800 truncate">
                                {t.event}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-neutral-400 flex items-center gap-1">
                                  <Calendar size={10} />
                                  {t.date}
                                </span>
                                <span className="text-xs text-neutral-400 flex items-center gap-1">
                                  <Star size={10} />
                                  Seat {t.seat}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`text-[10px] font-medium px-2 py-1 rounded-full ${t.status === "upcoming" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"}`}
                              >
                                {t.status}
                              </span>
                              <p className="text-xs font-semibold text-neutral-700 mt-1.5">
                                ₦{t.price.toLocaleString("en-NG")}
                              </p>
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-neutral-200 group-hover:text-[#ff7f11ff] transition-colors shrink-0"
                            />
                          </motion.div>
                        ))}
                        {filteredTickets.length === 0 && (
                          <div className="text-center py-10 text-sm text-neutral-400">
                            No {ticketFilter !== "all" ? ticketFilter : ""}{" "}
                            tickets found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Saved Events */}
                  {activeTab === "saved" && (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      {saved.map((ev, i) => (
                        <motion.div
                          key={ev.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 }}
                          layout
                          className="flex items-center gap-4 p-4 border border-neutral-100 rounded-xl hover:border-[#ff7f11ff]/25 hover:shadow-sm transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#ff7f11ff]/10 flex items-center justify-center shrink-0">
                            <Heart size={14} className="text-[#ff7f11ff]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-800 truncate">
                              {ev.name}
                            </p>
                            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                              <Clock size={10} />
                              {ev.date}
                            </p>
                          </div>
                          <div className="text-right shrink-0 space-y-1.5">
                            <p className="text-sm font-semibold text-neutral-800">
                              {ev.price === 0
                                ? "Free"
                                : `₦${ev.price.toLocaleString("en-NG")}`}
                            </p>
                            <div className="flex gap-1.5 justify-end">
                              <motion.button
                                onClick={() =>
                                  showToast(
                                    `Buying ticket for ${ev.name}...`,
                                    "success",
                                  )
                                }
                                whileTap={{ scale: 0.94 }}
                                className="text-[10px] text-white font-medium bg-[#ff7f11ff] hover:bg-[#e66f00] px-2.5 py-1 rounded-lg transition-colors"
                              >
                                Get Ticket
                              </motion.button>
                              <motion.button
                                onClick={() => removeSaved(ev.id)}
                                whileTap={{ scale: 0.94 }}
                                className="text-[10px] text-neutral-400 hover:text-red-500 border border-neutral-200 hover:border-red-200 px-2 py-1 rounded-lg transition-colors"
                              >
                                <Trash2 size={10} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {saved.length === 0 && (
                        <div className="text-center py-10">
                          <Heart
                            size={28}
                            className="text-neutral-200 mx-auto mb-3"
                          />
                          <p className="text-sm text-neutral-400">
                            No saved events yet
                          </p>
                          <Link
                            to="/discover"
                            className="text-xs text-[#ff7f11ff] mt-1 inline-block hover:underline"
                          >
                            Browse events →
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm">
                <h2 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Account Settings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "Change Password",
                      desc: "Update your login credentials",
                      icon: "🔒",
                      action: () => setModal("password"),
                    },
                    {
                      label: "Download My Data",
                      desc: "Export all your account data",
                      icon: "📦",
                      action: () =>
                        showToast("Preparing your data export...", "info"),
                    },
                    {
                      label: "Privacy Settings",
                      desc: "Control your data & visibility",
                      icon: "🛡️",
                      action: () =>
                        showToast("Privacy settings coming soon!", "info"),
                    },
                    {
                      label: "Manage Devices",
                      desc: "View active login sessions",
                      icon: "📱",
                      action: () =>
                        showToast("Session manager coming soon!", "info"),
                    },
                  ].map((item, i) => (
                    <motion.button
                      key={i}
                      onClick={item.action}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-start gap-3 p-4 rounded-xl border border-neutral-100 text-left hover:border-[#ff7f11ff]/30 hover:bg-[#ff7f11ff]/[0.02] transition-all group"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 + 0.2 }}
                    >
                      <span className="text-base leading-none mt-0.5">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-700 group-hover:text-[#ff7f11ff] transition-colors">
                          {item.label}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight
                        size={13}
                        className="text-neutral-200 group-hover:text-[#ff7f11ff] transition-colors mt-0.5 shrink-0"
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Danger Row */}
                <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-red-100 rounded-xl bg-red-50/30">
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      Delete Account
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setModal("delete")}
                    whileTap={{ scale: 0.96 }}
                    className="mt-2 sm:mt-0 ml-0 sm:ml-4 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors shrink-0"
                  >
                    <Trash2 size={12} /> Delete
                  </motion.button>
                </div>

                {/* Logout */}
                <motion.button
                  onClick={() => showToast("Signing out...", "info")}
                  whileTap={{ scale: 0.97 }}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
                >
                  <LogOut size={14} /> Sign Out
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      {/* Ticket Detail */}
      <Modal
        open={modal === "ticket"}
        onClose={() => setModal(null)}
        title="Ticket Details"
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="p-4 bg-[#ff7f11ff]/5 rounded-xl border border-[#ff7f11ff]/10 text-center">
              <p className="text-lg font-mono font-bold text-[#ff7f11ff]">
                {selectedTicket.id}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {selectedTicket.event}
              </p>
            </div>
            {[
              ["Date", selectedTicket.date],
              ["Seat", selectedTicket.seat],
              ["Price", `₦${selectedTicket.price.toLocaleString("en-NG")}`],
              ["Status", selectedTicket.status],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between py-2 border-b border-neutral-50 last:border-0"
              >
                <span className="text-xs text-neutral-400">{k}</span>
                <span className="text-xs font-semibold text-neutral-700 capitalize">
                  {v}
                </span>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <motion.button
                onClick={() => {
                  showToast("Ticket downloaded!", "success");
                  setModal(null);
                }}
                whileTap={{ scale: 0.96 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
              >
                <Download size={13} /> Download
              </motion.button>
              {selectedTicket.status === "upcoming" && (
                <motion.button
                  onClick={() => {
                    setTickets((p) =>
                      p.filter((t) => t.id !== selectedTicket.id),
                    );
                    setModal(null);
                    showToast("Ticket cancelled. Refund initiated.", "error");
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="px-4 py-2.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Change Password */}
      <Modal
        open={modal === "password"}
        onClose={() => setModal(null)}
        title="Change Password"
      >
        <div className="space-y-4">
          {[
            { key: "current", label: "Current Password" },
            { key: "newPass", label: "New Password" },
            { key: "confirm", label: "Confirm New Password" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                {label}
              </label>
              <div className="relative">
                <input
                  type={showPw[key] ? "text" : "password"}
                  className={`${inp} pr-10`}
                  value={passwords[key]}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, [key]: e.target.value }))
                  }
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          {passwords.newPass.length > 0 && passwords.newPass.length < 8 && (
            <p className="text-xs text-amber-500 flex items-center gap-1">
              <AlertTriangle size={11} /> Minimum 8 characters
            </p>
          )}
          {passwords.newPass &&
            passwords.confirm &&
            passwords.newPass !== passwords.confirm && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle size={11} /> Passwords don't match
              </p>
            )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handlePasswordChange}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
            >
              Update
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete Account */}
      <Modal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <p className="text-sm text-neutral-600 text-center">
            This action is{" "}
            <span className="font-semibold text-neutral-800">permanent</span>.
            All your tickets, data and history will be deleted.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={() => {
                setModal(null);
                showToast("Account deletion is disabled in demo.", "error");
              }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </Modal>

      <Toast toasts={toasts} />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Profile;
