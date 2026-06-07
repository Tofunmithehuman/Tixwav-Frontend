import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
  Upload,
} from "lucide-react";

// Redux
import { logoutUser, selectUser } from "../store/slices/authSlice";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  getMyOrders,
  selectProfile,
  selectOrders,
  selectOrdersPagination,
  selectIsUpdating,
  selectIsAvatarUploading,
  selectIsPasswordChanging,
  selectIsOrdersLoading,
  selectPasswordError,
  clearPasswordError,
} from "../store/slices/userSlice";

// ── Toast ─────────────────────────────────────────────────────────────────────
const ToastIcon = ({ type }) =>
  type === "success" ? (
    <CheckCircle size={14} />
  ) : type === "error" ? (
    <XCircle size={14} />
  ) : (
    <Bell size={14} />
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
    className="relative rounded-full transition-colors shrink-0"
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const authUser = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const orders = useSelector(selectOrders);
  const ordersPagination = useSelector(selectOrdersPagination);
  const isUpdating = useSelector(selectIsUpdating);
  const isAvatarUploading = useSelector(selectIsAvatarUploading);
  const isPasswordChanging = useSelector(selectIsPasswordChanging);
  const isOrdersLoading = useSelector(selectIsOrdersLoading);
  const passwordError = useSelector(selectPasswordError);

  // Use profile data if loaded, fall back to auth user
  const user = profile || authUser;

  const [activeTab, setActiveTab] = useState("tickets");
  const [modal, setModal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({});
  const avatarInputRef = useRef(null);

  // Ticket filter (orders from API)
  const [ticketFilter, setTicketFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Saved events (UI-only for now — no API endpoint provided)
  const [saved, setSaved] = useState([]);

  // Notifications (local only)
  const [notifs, setNotifs] = useState({
    eventReminders: true,
    newEvents: true,
    ticketUpdates: true,
    newsletter: false,
    smsAlerts: false,
  });

  // Password change form
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

  // ── On mount: load profile + orders ───────────────────────────────────────
  useEffect(() => {
    dispatch(getProfile());
    dispatch(getMyOrders());
  }, [dispatch]);

  // Sync draft when profile loads
  useEffect(() => {
    if (user) {
      setDraft({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Show password error from Redux as toast
  useEffect(() => {
    if (passwordError) {
      toast.error(passwordError);
      dispatch(clearPasswordError());
    }
  }, [passwordError]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = () => {
    const { firstName, lastName, phone, bio } = draft;
    dispatch(updateProfile({ firstName, lastName, phone, bio }))
      .unwrap()
      .then(() => {
        setEditMode(false);
        toast.success("Profile updated!");
      })
      .catch((err) => toast.error(err || "Failed to update profile"));
  };

  const handleCancel = () => {
    setDraft({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    });
    setEditMode(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    dispatch(updateAvatar(file))
      .unwrap()
      .then(() => toast.success("Avatar updated!"))
      .catch((err) => toast.error(err || "Failed to upload avatar"));
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.error("Please fill all fields.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error("Password must be 8+ characters.");
      return;
    }
    dispatch(
      changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      }),
    )
      .unwrap()
      .then(() => {
        setPasswords({ current: "", newPass: "", confirm: "" });
        setModal(null);
        toast.success("Password changed successfully!");
      })
      .catch(() => {}); // handled by passwordError useEffect
  };

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.info("Signed out.");
        navigate("/login", { replace: true });
      })
      .catch(() => navigate("/login", { replace: true }));
  };

  const removeSaved = (id) => {
    setSaved((p) => p.filter((e) => e.id !== id));
    toast.info("Event removed from saved.");
  };

  // ── Derived stats from orders ─────────────────────────────────────────────
  const attendedCount = orders.filter(
    (o) => o.event?.status === "completed",
  ).length;
  const totalSpent = orders.reduce((a, o) => a + (o.totalAmount || 0), 0);
  const stats = [
    { label: "Events Attended", value: attendedCount, icon: Calendar },
    { label: "Orders", value: orders.length, icon: Ticket },
    { label: "Saved Events", value: saved.length, icon: Heart },
    {
      label: "Total Spent",
      value: `₦${totalSpent.toLocaleString("en-NG")}`,
      icon: Star,
    },
  ];

  // Filter orders for tickets tab
  const filteredOrders =
    ticketFilter === "all"
      ? orders
      : orders.filter((o) => {
          if (ticketFilter === "upcoming")
            return (
              o.event?.status === "active" || o.event?.status === "upcoming"
            );
          if (ticketFilter === "attended")
            return o.event?.status === "completed";
          return true;
        });

  const inp =
    "w-full border border-neutral-200 focus:border-[#ff7f11ff] rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none transition-colors bg-white";

  // Avatar initials
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    : "?";

  return (
    <div>
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
              {user?.avatar && user.avatar.trim() !== "" ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                style={{
                  display:
                    user?.avatar && user.avatar.trim() !== "" ? "none" : "flex",
                }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#ff7f11ff] to-[#ff3f00] flex items-center justify-center text-white text-3xl font-semibold shadow-lg border-4 border-white select-none"
              >
                {initials}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <motion.button
                onClick={() => avatarInputRef.current?.click()}
                disabled={isAvatarUploading}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm hover:border-[#ff7f11ff] transition-colors disabled:opacity-50"
              >
                {isAvatarUploading ? (
                  <div className="w-3 h-3 border border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={12} className="text-neutral-500" />
                )}
              </motion.button>
            </div>

            <div className="flex-1 pb-1">
              <h1 className="text-xl font-semibold text-neutral-800">
                {user ? `${user.firstName} ${user.lastName}` : "Loading…"}
              </h1>
              <p className="text-sm text-neutral-400 flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-[#ff7f11ff]" />
                {user?.email || user?.phone || ""}
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
                    onClick={() => toast.info("Downloading your data…")}
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
                    disabled={isUpdating}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff7f11ff] text-white text-sm font-medium hover:bg-[#e66f00] transition-colors disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    Save
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
                    ].map(([label, key, type]) => (
                      <div key={key}>
                        <label className="text-[10px] text-neutral-400 font-semibold uppercase">
                          {label}
                        </label>
                        <input
                          type={type}
                          disabled={key === "email"}
                          className={`mt-1 ${inp} ${key === "email" ? "opacity-50 cursor-not-allowed" : ""}`}
                          value={draft[key] || ""}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, [key]: e.target.value }))
                          }
                        />
                        {key === "email" && (
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            Email cannot be changed here
                          </p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] text-neutral-400 font-semibold uppercase">
                        Bio
                      </label>
                      <textarea
                        className={`mt-1 ${inp} resize-none`}
                        rows={3}
                        value={draft.bio || ""}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, bio: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { icon: Mail, value: user?.email },
                      { icon: Phone, value: user?.phone || "Not set" },
                    ].map(({ icon: Icon, value }, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Icon
                          size={13}
                          className="text-neutral-300 mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-neutral-600 break-all">
                          {value}
                        </p>
                      </div>
                    ))}
                    {user?.bio && (
                      <p className="text-xs text-neutral-500 pt-1 border-t border-neutral-50">
                        {user.bio}
                      </p>
                    )}
                    {user?.isEmailVerified !== undefined && (
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${user.isEmailVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                      >
                        {user.isEmailVerified ? (
                          <CheckCircle size={10} />
                        ) : (
                          <AlertTriangle size={10} />
                        )}
                        {user.isEmailVerified
                          ? "Email verified"
                          : "Email not verified"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ─ RIGHT ─ */}
            <motion.div
              className="lg:col-span-2 space-y-5"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Tabs */}
              <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex border-b border-neutral-100">
                  {[
                    { key: "tickets", label: "Tickets", icon: Ticket },
                    { key: "saved", label: "Saved", icon: Heart },
                    { key: "notifications", label: "Alerts", icon: Bell },
                    { key: "settings", label: "Settings", icon: Shield },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-medium transition-colors ${
                          activeTab === tab.key
                            ? "text-[#ff7f11ff] border-b-2 border-[#ff7f11ff] -mb-px bg-[#ff7f11ff]/[0.02]"
                            : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        <Icon size={13} />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-5">
                  {/* ── Tickets Tab ─────────────────────────────────────── */}
                  {activeTab === "tickets" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        {["all", "upcoming", "attended"].map((f) => (
                          <button
                            key={f}
                            onClick={() => setTicketFilter(f)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                              ticketFilter === f
                                ? "bg-[#ff7f11ff] text-white"
                                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>

                      {isOrdersLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-6 h-6 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                          <Ticket
                            size={32}
                            className="text-neutral-200 mx-auto mb-2"
                          />
                          <p className="text-sm text-neutral-400">
                            No tickets found
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {filteredOrders.map((order, i) => (
                            <motion.div
                              key={order._id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              onClick={() => {
                                setSelectedTicket(order);
                                setModal("ticket");
                              }}
                              className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-100 hover:border-[#ff7f11ff]/30 hover:bg-[#ff7f11ff]/[0.02] cursor-pointer transition-all group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-[#ff7f11ff]/10 flex items-center justify-center shrink-0">
                                <Ticket
                                  size={15}
                                  className="text-[#ff7f11ff]"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-700 truncate group-hover:text-[#ff7f11ff] transition-colors">
                                  {order.event?.title || "Event"}
                                </p>
                                <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} />
                                  {order.event?.startDate
                                    ? new Date(
                                        order.event.startDate,
                                      ).toLocaleDateString("en-NG", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "Date TBD"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                                    order.status === "completed"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : order.status === "paid"
                                        ? "bg-blue-50 text-blue-600"
                                        : "bg-amber-50 text-amber-600"
                                  }`}
                                >
                                  {order.status}
                                </span>
                                <ChevronRight
                                  size={13}
                                  className="text-neutral-200 group-hover:text-[#ff7f11ff] transition-colors"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── Saved Tab ───────────────────────────────────────── */}
                  {activeTab === "saved" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {saved.length === 0 ? (
                        <div className="text-center py-12">
                          <Heart
                            size={32}
                            className="text-neutral-200 mx-auto mb-2"
                          />
                          <p className="text-sm text-neutral-400">
                            No saved events
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {saved.map((event, i) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-all group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                                <Heart size={15} className="text-rose-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-700 truncate">
                                  {event.name}
                                </p>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                  {event.date} · {event.category}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-[#ff7f11ff]">
                                  {event.price === 0
                                    ? "Free"
                                    : `₦${event.price.toLocaleString("en-NG")}`}
                                </span>
                                <motion.button
                                  onClick={() => removeSaved(event.id)}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 rounded-lg hover:bg-red-50 text-neutral-300 hover:text-red-400 transition-colors"
                                >
                                  <X size={13} />
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── Notifications Tab ───────────────────────────────── */}
                  {activeTab === "notifications" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {[
                        {
                          key: "eventReminders",
                          label: "Event Reminders",
                          desc: "Get notified before events you've booked",
                        },
                        {
                          key: "newEvents",
                          label: "New Events",
                          desc: "Be the first to know about new events",
                        },
                        {
                          key: "ticketUpdates",
                          label: "Ticket Updates",
                          desc: "Changes to your booked tickets",
                        },
                        {
                          key: "newsletter",
                          label: "Newsletter",
                          desc: "Weekly digest of events near you",
                        },
                        {
                          key: "smsAlerts",
                          label: "SMS Alerts",
                          desc: "Text message reminders",
                        },
                      ].map(({ key, label, desc }) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 hover:bg-neutral-50/50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-700">
                              {label}
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {desc}
                            </p>
                          </div>
                          <Toggle
                            value={notifs[key]}
                            onChange={(v) =>
                              setNotifs((p) => ({ ...p, [key]: v }))
                            }
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* ── Settings Tab ────────────────────────────────────── */}
                  {activeTab === "settings" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="space-y-2">
                        {[
                          {
                            icon: "🔑",
                            label: "Change Password",
                            desc: "Update your account password",
                            action: () => setModal("password"),
                          },
                          {
                            icon: "🛡️",
                            label: "Two-Factor Auth",
                            desc: "Add an extra layer of security",
                            action: () => toast.info("2FA coming soon!"),
                          },
                          {
                            icon: "📁",
                            label: "Export My Data",
                            desc: "Download a copy of your account data",
                            action: () =>
                              toast.info("Data export coming soon!"),
                          },
                        ].map((item, i) => (
                          <motion.button
                            key={i}
                            onClick={item.action}
                            whileTap={{ scale: 0.99 }}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50 transition-all text-left group"
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
                        onClick={handleLogout}
                        whileTap={{ scale: 0.97 }}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
                      >
                        <LogOut size={14} /> Sign Out
                      </motion.button>
                    </motion.div>
                  )}
                </div>
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
        title="Order Details"
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="p-4 bg-[#ff7f11ff]/5 rounded-xl border border-[#ff7f11ff]/10 text-center">
              <p className="text-lg font-mono font-bold text-[#ff7f11ff]">
                {selectedTicket._id?.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {selectedTicket.event?.title || "Event"}
              </p>
            </div>
            {[
              [
                "Date",
                selectedTicket.event?.startDate
                  ? new Date(
                      selectedTicket.event.startDate,
                    ).toLocaleDateString()
                  : "TBD",
              ],
              ["Venue", selectedTicket.event?.venue?.name || "TBD"],
              [
                "Amount",
                selectedTicket.totalAmount != null
                  ? `₦${selectedTicket.totalAmount.toLocaleString("en-NG")}`
                  : "–",
              ],
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
            <motion.button
              onClick={() => {
                toast.success("Ticket downloaded!");
                setModal(null);
              }}
              whileTap={{ scale: 0.96 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
            >
              <Download size={13} /> Download
            </motion.button>
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
              disabled={isPasswordChanging}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPasswordChanging ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Updating…
                </>
              ) : (
                "Update"
              )}
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
                toast.error("Account deletion is disabled. Contact support.");
              }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </Modal>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Profile;
