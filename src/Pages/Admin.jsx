import { useState } from "react";
import { Link } from "react-router-dom";
import * as motion from "motion/react-client";
import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Search,
  Bell,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  Filter,
  Download,
  Upload,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Shield,
  Key,
  Mail,
  Phone,
  Globe,
  Save,
  ChevronDown,
  RefreshCw,
  ArrowUpRight,
  Layers,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Menu,
} from "lucide-react";

// ─── Shared Data ────────────────────────────────────────────────────────────

const initialEvents = [
  {
    id: 1,
    name: "Design Systems Meetup",
    date: "Apr 28, 2026",
    category: "Tech",
    tickets: 120,
    sold: 98,
    revenue: 490000,
    status: "active",
    location: "Lagos",
  },
  {
    id: 2,
    name: "React Conference 2026",
    date: "May 10, 2026",
    category: "Tech",
    tickets: 500,
    sold: 412,
    revenue: 10300000,
    status: "active",
    location: "Abuja",
  },
  {
    id: 3,
    name: "Web Performance Workshop",
    date: "May 3, 2026",
    category: "Workshop",
    tickets: 80,
    sold: 80,
    revenue: 0,
    status: "sold-out",
    location: "Lagos",
  },
  {
    id: 4,
    name: "AI & Machine Learning Summit",
    date: "Jun 1, 2026",
    category: "Tech",
    tickets: 200,
    sold: 34,
    revenue: 850000,
    status: "active",
    location: "Port Harcourt",
  },
  {
    id: 5,
    name: "JavaScript Masterclass",
    date: "Apr 22, 2026",
    category: "Workshop",
    tickets: 60,
    sold: 60,
    revenue: 1200000,
    status: "ended",
    location: "Lagos",
  },
  {
    id: 6,
    name: "UX Design Bootcamp",
    date: "Jun 14, 2026",
    category: "Design",
    tickets: 40,
    sold: 12,
    revenue: 480000,
    status: "active",
    location: "Lagos",
  },
];

const initialUsers = [
  {
    id: 1,
    name: "Amara Osei",
    email: "amara@email.com",
    phone: "+234 812 345 6789",
    joined: "Apr 19, 2026",
    tickets: 3,
    status: "active",
    role: "user",
  },
  {
    id: 2,
    name: "Kwame Boateng",
    email: "kwame@email.com",
    phone: "+234 803 456 7890",
    joined: "Apr 18, 2026",
    tickets: 1,
    status: "active",
    role: "user",
  },
  {
    id: 3,
    name: "Fatima Al-Hassan",
    email: "fatima@email.com",
    phone: "+234 701 234 5678",
    joined: "Apr 18, 2026",
    tickets: 7,
    status: "active",
    role: "organizer",
  },
  {
    id: 4,
    name: "Emeka Nwosu",
    email: "emeka@email.com",
    phone: "+234 815 678 9012",
    joined: "Apr 17, 2026",
    tickets: 2,
    status: "suspended",
    role: "user",
  },
  {
    id: 5,
    name: "Chidinma Eze",
    email: "chidinma@email.com",
    phone: "+234 909 876 5432",
    joined: "Apr 15, 2026",
    tickets: 5,
    status: "active",
    role: "organizer",
  },
  {
    id: 6,
    name: "Tunde Adeyemi",
    email: "tunde@email.com",
    phone: "+234 706 543 2109",
    joined: "Apr 10, 2026",
    tickets: 0,
    status: "inactive",
    role: "user",
  },
];

const allTickets = [
  {
    id: "TXW-001",
    event: "React Conference 2026",
    buyer: "Amara Osei",
    email: "amara@email.com",
    date: "May 10, 2026",
    seat: "A-14",
    price: 25000,
    status: "confirmed",
  },
  {
    id: "TXW-002",
    event: "Design Systems Meetup",
    buyer: "Kwame Boateng",
    email: "kwame@email.com",
    date: "Apr 28, 2026",
    seat: "General",
    price: 5000,
    status: "confirmed",
  },
  {
    id: "TXW-003",
    event: "Web Performance Workshop",
    buyer: "Fatima Al-Hassan",
    email: "fatima@email.com",
    date: "May 3, 2026",
    seat: "B-07",
    price: 15000,
    status: "confirmed",
  },
  {
    id: "TXW-004",
    event: "JavaScript Masterclass",
    buyer: "Emeka Nwosu",
    email: "emeka@email.com",
    date: "Apr 22, 2026",
    seat: "C-02",
    price: 20000,
    status: "cancelled",
  },
  {
    id: "TXW-005",
    event: "AI Summit",
    buyer: "Chidinma Eze",
    email: "chidinma@email.com",
    date: "Jun 1, 2026",
    seat: "D-11",
    price: 25000,
    status: "pending",
  },
  {
    id: "TXW-006",
    event: "React Conference 2026",
    buyer: "Tunde Adeyemi",
    email: "tunde@email.com",
    date: "May 10, 2026",
    seat: "A-22",
    price: 25000,
    status: "confirmed",
  },
  {
    id: "TXW-007",
    event: "UX Design Bootcamp",
    buyer: "Amara Osei",
    email: "amara@email.com",
    date: "Jun 14, 2026",
    seat: "E-03",
    price: 40000,
    status: "confirmed",
  },
];

const dummyRevenueData = [
  { day: "Mon", value: 65, amount: "₦1.2M" },
  { day: "Tue", value: 45, amount: "₦850k" },
  { day: "Wed", value: 85, amount: "₦2.1M" },
  { day: "Thu", value: 30, amount: "₦600k" },
  { day: "Fri", value: 95, amount: "₦2.8M" },
  { day: "Sat", value: 75, amount: "₦1.8M" },
  { day: "Sun", value: 55, amount: "₦1.1M" },
];

const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

// ─── Reusable Modal ──────────────────────────────────────────────────────────
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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 max-h-[90vh] overflow-y-auto"
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
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 pointer-events-auto ${
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

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage = ({ setPage }) => {
  const stats = [
    {
      label: "Total Revenue",
      value: fmt(48295000),
      change: "+12.5%",
      up: true,
      icon: DollarSign,
      color: "#ff7f11",
    },
    {
      label: "Tickets Sold",
      value: "3,842",
      change: "+8.2%",
      up: true,
      icon: Ticket,
      color: "#ff3f00",
    },
    {
      label: "Active Events",
      value: "24",
      change: "-2.1%",
      up: false,
      icon: Calendar,
      color: "#beb7a4",
    },
    {
      label: "Total Users",
      value: "12,540",
      change: "+18.7%",
      up: true,
      icon: Users,
      color: "#ff7f11",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const weekBars = [55, 70, 45, 85, 60, 92, 78];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${s.color}18` }}
                >
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${s.up ? "text-emerald-500" : "text-red-400"}`}
                >
                  {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{" "}
                  {s.change}
                </span>
              </div>
              <p className="text-xl font-semibold text-neutral-800">
                {s.value}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white border border-neutral-100 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-800">
                Revenue Overview
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Last 7 Days</p>
            </div>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <TrendingUp size={12} /> +14.3%
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 pt-4">
            {dummyRevenueData.map((data, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-3 group relative"
              >
                {/* Tooltip on Hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {data.amount}
                </div>

                {/* Animated Bar */}
                <div
                  className="w-full flex flex-col justify-end"
                  style={{ height: "160px" }}
                >
                  <motion.div
                    className="w-full bg-[#ff7f11ff]/10 rounded-t-md overflow-hidden relative"
                    initial={{ height: 0 }}
                    animate={{ height: `${data.value}%` }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  >
                    {/* Darker Inner Bar for Aesthetic Depth */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-[#ff7f11ff] rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                    />
                  </motion.div>
                </div>

                <span className="text-[10px] font-medium text-neutral-400 group-hover:text-[#ff7f11ff] transition-colors">
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm space-y-4"
        >
          <h2 className="text-sm font-semibold text-neutral-800">
            Quick Summary
          </h2>
          {[
            { label: "Avg Ticket Price", value: fmt(12560) },
            { label: "Revenue Today", value: fmt(1250000) },
            { label: "New Users Today", value: "34" },
            { label: "Events This Month", value: "8" },
            { label: "Pending Refunds", value: "3" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0"
            >
              <span className="text-xs text-neutral-500">{item.label}</span>
              <span className="text-xs font-semibold text-neutral-800">
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Recent Events & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          variants={itemVariants}
          className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50">
            <h2 className="text-sm font-semibold text-neutral-800">
              Recent Events
            </h2>
            <button
              onClick={() => setPage("events")}
              className="text-xs text-[#ff7f11ff] flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-neutral-50">
            {initialEvents.slice(0, 4).map((ev, i) => (
              <motion.div
                key={ev.id}
                className="flex items-center gap-3 px-6 py-3.5 hover:bg-neutral-50/60 transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#ff7f11ff]/10 flex items-center justify-center shrink-0">
                  <Calendar size={13} className="text-[#ff7f11ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-700 truncate">
                    {ev.name}
                  </p>
                  <p className="text-[10px] text-neutral-400">{ev.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-neutral-700">
                    {fmt(ev.revenue)}
                  </p>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      ev.status === "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : ev.status === "sold-out"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50">
            <h2 className="text-sm font-semibold text-neutral-800">
              Recent Users
            </h2>
            <button
              onClick={() => setPage("users")}
              className="text-xs text-[#ff7f11ff] flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-neutral-50">
            {initialUsers.slice(0, 4).map((u, i) => (
              <motion.div
                key={u.id}
                className="flex items-center gap-3 px-6 py-3.5 hover:bg-neutral-50/60 transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff7f11ff]/20 to-[#ff3f00]/10 flex items-center justify-center text-[#ff7f11ff] text-xs font-semibold shrink-0">
                  {u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-700 truncate">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-neutral-400">{u.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium text-[#ff7f11ff]">
                    {u.tickets} tickets
                  </p>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      u.status === "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : u.status === "suspended"
                          ? "bg-red-50 text-red-500"
                          : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Events Page ──────────────────────────────────────────────────────────────
const EventsPage = ({ showToast }) => {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "view" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: "",
    date: "",
    category: "Tech",
    tickets: "",
    price: "",
    location: "",
    status: "active",
  });

  const filtered = events.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.status === filter;
    return matchSearch && matchFilter;
  });

  const openAdd = () => {
    setForm({
      name: "",
      date: "",
      category: "Tech",
      tickets: "",
      price: "",
      location: "",
      status: "active",
    });
    setModal("add");
  };
  const openEdit = (ev) => {
    setSelected(ev);
    setForm({ ...ev, price: ev.revenue });
    setModal("edit");
  };
  const openView = (ev) => {
    setSelected(ev);
    setModal("view");
  };
  const openDelete = (ev) => {
    setSelected(ev);
    setModal("delete");
  };

  const handleAdd = () => {
    const newEv = {
      ...form,
      id: Date.now(),
      sold: 0,
      revenue: Number(form.price) || 0,
      tickets: Number(form.tickets) || 0,
    };
    setEvents((prev) => [newEv, ...prev]);
    setModal(null);
    showToast("Event created successfully!", "success");
  };

  const handleEdit = () => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === selected.id
          ? { ...e, ...form, tickets: Number(form.tickets) || e.tickets }
          : e,
      ),
    );
    setModal(null);
    showToast("Event updated!", "success");
  };

  const handleDelete = () => {
    setEvents((prev) => prev.filter((e) => e.id !== selected.id));
    setModal(null);
    showToast("Event deleted.", "error");
  };

  const statusBadge = (s) =>
    ({
      active: "bg-emerald-50 text-emerald-600",
      "sold-out": "bg-orange-50 text-orange-600",
      ended: "bg-neutral-100 text-neutral-400",
      draft: "bg-blue-50 text-blue-500",
    })[s] || "bg-neutral-100 text-neutral-400";

  const inp =
    "w-full border border-neutral-200 focus:border-[#ff7f11ff] rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-800">Events</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {events.length} total events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Download size={13} /> Export
          </button>
          <motion.button
            onClick={openAdd}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff7f11ff] text-white rounded-lg text-xs font-semibold hover:bg-[#e66f00] transition-colors"
          >
            <Plus size={13} /> Add Event
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-8 pr-4 py-2.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#ff7f11ff] transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "active", "sold-out", "ended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${filter === f ? "bg-[#ff7f11ff] text-white" : "border border-neutral-200 text-neutral-500 hover:border-[#ff7f11ff] hover:text-[#ff7f11ff]"}`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-50 bg-neutral-50/50">
                {[
                  "Event",
                  "Date",
                  "Location",
                  "Sales",
                  "Revenue",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => (
                <motion.tr
                  key={ev.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-neutral-50 hover:bg-neutral-50/40 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#ff7f11ff]/10 flex items-center justify-center shrink-0">
                        <Calendar size={12} className="text-[#ff7f11ff]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-700 truncate max-w-[160px]">
                          {ev.name}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {ev.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-500 whitespace-nowrap">
                    {ev.date}
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-500">
                    {ev.location}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ff7f11ff] rounded-full"
                          style={{ width: `${(ev.sold / ev.tickets) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                        {ev.sold}/{ev.tickets}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-neutral-700 whitespace-nowrap">
                    {fmt(ev.revenue)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-medium px-2 py-1 rounded-full capitalize ${statusBadge(ev.status)}`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openView(ev)}
                        className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#ff7f11ff] transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => openDelete(ev)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-neutral-400">
              No events found
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        open={modal === "add"}
        onClose={() => setModal(null)}
        title="Create New Event"
      >
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 uppercase">
              Event Name
            </label>
            <input
              className={`mt-1 ${inp}`}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Event name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase">
                Date
              </label>
              <input
                type="date"
                className={`mt-1 ${inp}`}
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase">
                Category
              </label>
              <select
                className={`mt-1 ${inp}`}
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              >
                {[
                  "Tech",
                  "Workshop",
                  "Design",
                  "Business",
                  "Music",
                  "Other",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase">
                Total Tickets
              </label>
              <input
                type="number"
                className={`mt-1 ${inp}`}
                value={form.tickets}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tickets: e.target.value }))
                }
                placeholder="100"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase">
                Price (₦)
              </label>
              <input
                type="number"
                className={`mt-1 ${inp}`}
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="5000"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 uppercase">
              Location
            </label>
            <input
              className={`mt-1 ${inp}`}
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              placeholder="Lagos"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
            >
              Create Event
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={modal === "edit"}
        onClose={() => setModal(null)}
        title="Edit Event"
      >
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 uppercase">
              Event Name
            </label>
            <input
              className={`mt-1 ${inp}`}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase">
                Date
              </label>
              <input
                className={`mt-1 ${inp}`}
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase">
                Status
              </label>
              <select
                className={`mt-1 ${inp}`}
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value }))
                }
              >
                {["active", "sold-out", "ended", "draft"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 uppercase">
              Location
            </label>
            <input
              className={`mt-1 ${inp}`}
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleEdit}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={modal === "view"}
        onClose={() => setModal(null)}
        title="Event Details"
      >
        {selected && (
          <div className="space-y-4">
            <div className="p-4 bg-[#ff7f11ff]/5 rounded-xl border border-[#ff7f11ff]/10">
              <p className="font-semibold text-neutral-800">{selected.name}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {selected.category} · {selected.location}
              </p>
            </div>
            {[
              ["Date", selected.date],
              ["Total Tickets", selected.tickets],
              ["Tickets Sold", selected.sold],
              ["Revenue", fmt(selected.revenue)],
              ["Status", selected.status],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between items-center py-2 border-b border-neutral-50 last:border-0"
              >
                <span className="text-xs text-neutral-400">{k}</span>
                <span className="text-xs font-semibold text-neutral-700 capitalize">
                  {v}
                </span>
              </div>
            ))}
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                <span>Ticket Sales</span>
                <span>
                  {Math.round((selected.sold / selected.tickets) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#ff7f11ff] rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(selected.sold / selected.tickets) * 100}%`,
                  }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        title="Delete Event"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-neutral-800">
              "{selected?.name}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleDelete}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

// ─── Tickets Page ─────────────────────────────────────────────────────────────
const TicketsPage = ({ showToast }) => {
  const [tickets, setTickets] = useState(allTickets);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = tickets.filter((t) => {
    const s = search.toLowerCase();
    const match =
      t.event.toLowerCase().includes(s) ||
      t.buyer.toLowerCase().includes(s) ||
      t.id.toLowerCase().includes(s);
    return match && (filter === "all" || t.status === filter);
  });

  const statusBadge = {
    confirmed: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-red-50 text-red-500",
    pending: "bg-amber-50 text-amber-600",
  };

  const handleCancel = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected.id ? { ...t, status: "cancelled" } : t,
      ),
    );
    setModal(null);
    showToast("Ticket cancelled.", "error");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-800">Tickets</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {tickets.length} total tickets issued
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event, buyer, or ticket ID..."
            className="w-full pl-8 pr-4 py-2.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#ff7f11ff] transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "confirmed", "pending", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-[#ff7f11ff] text-white" : "border border-neutral-200 text-neutral-500 hover:border-[#ff7f11ff] hover:text-[#ff7f11ff]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-50 bg-neutral-50/50">
                {[
                  "Ticket ID",
                  "Event",
                  "Buyer",
                  "Date",
                  "Seat",
                  "Price",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-neutral-50 hover:bg-neutral-50/40 transition-colors group"
                >
                  <td className="px-5 py-4 text-xs font-mono font-medium text-[#ff7f11ff]">
                    {t.id}
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-700 max-w-[140px] truncate">
                    {t.event}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#ff7f11ff]/10 flex items-center justify-center text-[10px] font-semibold text-[#ff7f11ff] shrink-0">
                        {t.buyer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-700">
                          {t.buyer}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {t.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-500 whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-500">
                    {t.seat}
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-neutral-700 whitespace-nowrap">
                    {fmt(t.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-medium px-2 py-1 rounded-full capitalize ${statusBadge[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelected(t);
                          setModal("view");
                        }}
                        className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                      {t.status !== "cancelled" && (
                        <button
                          onClick={() => {
                            setSelected(t);
                            setModal("cancel");
                          }}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <XCircle size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-neutral-400">
              No tickets found
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modal === "view"}
        onClose={() => setModal(null)}
        title="Ticket Details"
      >
        {selected && (
          <div className="space-y-4">
            <div className="p-4 bg-[#ff7f11ff]/5 rounded-xl border border-[#ff7f11ff]/10 text-center">
              <p className="text-lg font-mono font-bold text-[#ff7f11ff]">
                {selected.id}
              </p>
              <p className="text-xs text-neutral-500 mt-1">{selected.event}</p>
            </div>
            {[
              ["Buyer", selected.buyer],
              ["Email", selected.email],
              ["Date", selected.date],
              ["Seat", selected.seat],
              ["Price", fmt(selected.price)],
              ["Status", selected.status],
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
          </div>
        )}
      </Modal>

      <Modal
        open={modal === "cancel"}
        onClose={() => setModal(null)}
        title="Cancel Ticket"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <p className="text-sm text-neutral-600">
            Cancel ticket{" "}
            <span className="font-semibold text-neutral-800">
              {selected?.id}
            </span>{" "}
            for {selected?.buyer}?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Back
            </button>
            <motion.button
              onClick={handleCancel}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Cancel Ticket
            </motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

// ─── Users Page ───────────────────────────────────────────────────────────────
const UsersPage = ({ showToast }) => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
  });

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    const match =
      u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    return (
      match && (filter === "all" || u.status === filter || u.role === filter)
    );
  });

  const inp =
    "w-full border border-neutral-200 focus:border-[#ff7f11ff] rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none transition-colors";

  const handleSuspend = (u) => {
    setUsers((prev) =>
      prev.map((x) =>
        x.id === u.id
          ? { ...x, status: x.status === "suspended" ? "active" : "suspended" }
          : x,
      ),
    );
    showToast(
      u.status === "suspended" ? "User reactivated." : "User suspended.",
      u.status === "suspended" ? "success" : "error",
    );
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== selected.id));
    setModal(null);
    showToast("User removed.", "error");
  };

  const handleAddUser = () => {
    const newUser = {
      ...form,
      id: Date.now(),
      joined: "Apr 21, 2026",
      tickets: 0,
      status: "active",
    };
    setUsers((prev) => [newUser, ...prev]);
    setModal(null);
    showToast("User added!", "success");
  };

  const roleBadge = {
    user: "bg-blue-50 text-blue-500",
    organizer: "bg-purple-50 text-purple-600",
    admin: "bg-[#ff7f11ff]/10 text-[#ff7f11ff]",
  };
  const statusBadge = {
    active: "bg-emerald-50 text-emerald-600",
    suspended: "bg-red-50 text-red-500",
    inactive: "bg-neutral-100 text-neutral-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-800">Users</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {users.length} registered users
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Download size={13} /> Export
          </button>
          <motion.button
            onClick={() => {
              setForm({ name: "", email: "", phone: "", role: "user" });
              setModal("add");
            }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff7f11ff] text-white rounded-lg text-xs font-semibold hover:bg-[#e66f00] transition-colors"
          >
            <Plus size={13} /> Add User
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-8 pr-4 py-2.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#ff7f11ff] transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "active", "suspended", "organizer"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-[#ff7f11ff] text-white" : "border border-neutral-200 text-neutral-500 hover:border-[#ff7f11ff] hover:text-[#ff7f11ff]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-50 bg-neutral-50/50">
                {[
                  "User",
                  "Contact",
                  "Joined",
                  "Tickets",
                  "Role",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-neutral-50 hover:bg-neutral-50/40 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff7f11ff]/20 to-[#ff3f00]/10 flex items-center justify-center text-[#ff7f11ff] text-xs font-semibold shrink-0">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <p className="text-xs font-medium text-neutral-700">
                        {u.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-neutral-500">{u.email}</p>
                    <p className="text-[10px] text-neutral-400">{u.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-500 whitespace-nowrap">
                    {u.joined}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-neutral-700">
                    {u.tickets}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-medium px-2 py-1 rounded-full capitalize ${roleBadge[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-medium px-2 py-1 rounded-full capitalize ${statusBadge[u.status]}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelected(u);
                          setModal("view");
                        }}
                        className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleSuspend(u)}
                        className={`p-1.5 rounded-lg transition-colors ${u.status === "suspended" ? "hover:bg-emerald-50 text-neutral-400 hover:text-emerald-500" : "hover:bg-amber-50 text-neutral-400 hover:text-amber-500"}`}
                      >
                        {u.status === "suspended" ? (
                          <CheckCircle size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelected(u);
                          setModal("delete");
                        }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-neutral-400">
              No users found
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modal === "add"}
        onClose={() => setModal(null)}
        title="Add New User"
      >
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 uppercase">
              Full Name
            </label>
            <input
              className={`mt-1 ${inp}`}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 uppercase">
              Email
            </label>
            <input
              type="email"
              className={`mt-1 ${inp}`}
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 uppercase">
              Phone
            </label>
            <input
              className={`mt-1 ${inp}`}
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+234..."
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 uppercase">
              Role
            </label>
            <select
              className={`mt-1 ${inp}`}
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleAddUser}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
            >
              Add User
            </motion.button>
          </div>
        </div>
      </Modal>

      <Modal
        open={modal === "view"}
        onClose={() => setModal(null)}
        title="User Details"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#ff7f11ff]/5 rounded-xl border border-[#ff7f11ff]/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff7f11ff]/30 to-[#ff3f00]/20 flex items-center justify-center text-[#ff7f11ff] text-lg font-semibold">
                {selected.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  {selected.name}
                </p>
                <p className="text-xs text-neutral-500">{selected.role}</p>
              </div>
            </div>
            {[
              ["Email", selected.email],
              ["Phone", selected.phone],
              ["Joined", selected.joined],
              ["Tickets Purchased", selected.tickets],
              ["Status", selected.status],
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
          </div>
        )}
      </Modal>

      <Modal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        title="Remove User"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <p className="text-sm text-neutral-600">
            Remove{" "}
            <span className="font-semibold text-neutral-800">
              {selected?.name}
            </span>{" "}
            from the platform?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setModal(null)}
              className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleDelete}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Remove
            </motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

// ─── Analytics Page ───────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const monthlyRevenue = [
    3200000, 4100000, 3800000, 5200000, 4700000, 6100000, 5500000, 7200000,
    6800000, 8100000, 7600000, 9400000,
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const maxRev = Math.max(...monthlyRevenue);

  const categoryData = [
    { label: "Tech", value: 58, color: "#ff7f11" },
    { label: "Workshop", value: 22, color: "#ff3f00" },
    { label: "Design", value: 12, color: "#beb7a4" },
    { label: "Other", value: 8, color: "#e5e5e5" },
  ];

  const topEvents = [
    { name: "React Conference 2026", revenue: 10300000, tickets: 412 },
    { name: "JavaScript Masterclass", revenue: 1200000, tickets: 60 },
    { name: "AI Summit", revenue: 850000, tickets: 34 },
    { name: "Design Systems Meetup", revenue: 490000, tickets: 98 },
    { name: "UX Design Bootcamp", revenue: 480000, tickets: 12 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-base font-semibold text-neutral-800">Analytics</h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Platform performance overview
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: fmt(48295000),
            sub: "All time",
            up: true,
          },
          {
            label: "Avg. Revenue/Event",
            value: fmt(8049166),
            sub: "6 events",
            up: true,
          },
          {
            label: "Conversion Rate",
            value: "73.4%",
            sub: "Tickets sold",
            up: true,
          },
          {
            label: "Avg. Ticket Price",
            value: fmt(18750),
            sub: "Across all events",
            up: false,
          },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm"
          >
            <p className="text-xl font-semibold text-neutral-800">{k.value}</p>
            <p className="text-xs font-medium text-neutral-700 mt-1">
              {k.label}
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Revenue Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white border border-neutral-100 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-neutral-800 mb-6">
            Monthly Revenue (2026)
          </h3>
          <div className="flex items-end gap-2 h-40">
            {monthlyRevenue.map((val, i) => {
              const h = (val / maxRev) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div
                    className="relative w-full flex items-end"
                    style={{ height: "140px" }}
                  >
                    <motion.div
                      className="w-full rounded-t-sm bg-[#ff7f11ff] cursor-pointer group-hover:bg-[#e66f00] transition-colors"
                      style={{ height: `${h}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.04 + 0.3, duration: 0.5 }}
                      title={fmt(val)}
                    />
                  </div>
                  <span className="text-[9px] text-neutral-400">
                    {months[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-neutral-800 mb-5">
            Events by Category
          </h3>
          <div className="space-y-4">
            {categoryData.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-600 font-medium">
                    {c.label}
                  </span>
                  <span className="text-neutral-400">{c.value}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: c.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ delay: i * 0.08 + 0.4, duration: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Donut visual */}
          <div className="mt-6 flex justify-center">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {
                  categoryData.reduce(
                    (acc, c, i) => {
                      const offset = acc.offset;
                      const dash = c.value;
                      acc.els.push(
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="15.9155"
                          fill="none"
                          stroke={c.color}
                          strokeWidth="3.5"
                          strokeDasharray={`${dash} ${100 - dash}`}
                          strokeDashoffset={-offset}
                        />,
                      );
                      acc.offset += dash;
                      return acc;
                    },
                    { offset: 0, els: [] },
                  ).els
                }
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-700">100%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Events */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-sm font-semibold text-neutral-800 mb-5">
          Top Events by Revenue
        </h3>
        <div className="space-y-3">
          {topEvents.map((ev, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs font-bold text-neutral-300 w-4 shrink-0">
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-neutral-700 truncate">
                    {ev.name}
                  </p>
                  <p className="text-xs font-semibold text-neutral-800 ml-3 shrink-0">
                    {fmt(ev.revenue)}
                  </p>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#ff7f11ff] rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(ev.revenue / topEvents[0].revenue) * 100}%`,
                    }}
                    transition={{ delay: i * 0.08 + 0.5, duration: 0.6 }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 shrink-0 w-16 text-right">
                {ev.tickets} sold
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────
const SettingsPage = ({ showToast }) => {
  const [activeSection, setActiveSection] = useState("general");
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@tixwav.com",
    phone: "+234 800 000 0001",
    website: "tixwav.com",
  });
  const [notifs, setNotifs] = useState({
    newUser: true,
    newTicket: true,
    eventSold: false,
    weeklyReport: true,
    marketing: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [danger, setDanger] = useState({ confirmText: "" });

  const inp =
    "w-full border border-neutral-200 focus:border-[#ff7f11ff] rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none transition-colors";

  const sections = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${value ? "bg-[#ff7f11ff]" : "bg-neutral-200"}`}
      style={{ height: "22px" }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{ left: value ? "calc(100% - 18px)" : "2px" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-base font-semibold text-neutral-800">Settings</h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Manage your admin preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar nav */}
        <div className="bg-white border border-neutral-100 rounded-xl p-3 shadow-sm h-fit space-y-1">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                  activeSection === s.id
                    ? s.id === "danger"
                      ? "bg-red-50 text-red-500 font-medium"
                      : "bg-[#ff7f11ff]/10 text-[#ff7f11ff] font-medium"
                    : s.id === "danger"
                      ? "text-red-400 hover:bg-red-50"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                }`}
              >
                <Icon size={15} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white border border-neutral-100 rounded-xl p-6 shadow-sm">
          {activeSection === "general" && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-800 mb-4">
                General Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      className={`${inp} pl-8`}
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      className={`${inp} pl-8`}
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      className={`${inp} pl-8`}
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                    Website
                  </label>
                  <div className="relative">
                    <Globe
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      className={`${inp} pl-8`}
                      value={profile.website}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, website: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <motion.button
                  onClick={() => showToast("Settings saved!", "success")}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
                >
                  <Save size={14} /> Save Changes
                </motion.button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-800">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  {
                    key: "newUser",
                    label: "New User Registration",
                    desc: "Get notified when a new user signs up",
                  },
                  {
                    key: "newTicket",
                    label: "New Ticket Purchase",
                    desc: "Get notified on every ticket sale",
                  },
                  {
                    key: "eventSold",
                    label: "Event Sold Out",
                    desc: "Alert when an event reaches full capacity",
                  },
                  {
                    key: "weeklyReport",
                    label: "Weekly Report",
                    desc: "Receive a weekly analytics digest",
                  },
                  {
                    key: "marketing",
                    label: "Marketing Emails",
                    desc: "Receive product updates and offers",
                  },
                ].map((n) => (
                  <div
                    key={n.key}
                    className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-700">
                        {n.label}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {n.desc}
                      </p>
                    </div>
                    <Toggle
                      value={notifs[n.key]}
                      onChange={(v) => setNotifs((p) => ({ ...p, [n.key]: v }))}
                    />
                  </div>
                ))}
              </div>
              <motion.button
                onClick={() =>
                  showToast("Notification preferences saved!", "success")
                }
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
              >
                <Save size={14} /> Save Preferences
              </motion.button>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-800">
                Security
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className={inp}
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, current: e.target.value }))
                    }
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className={inp}
                    value={passwords.newPass}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, newPass: e.target.value }))
                    }
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className={inp}
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, confirm: e.target.value }))
                    }
                    placeholder="••••••••"
                  />
                </div>
                {passwords.newPass &&
                  passwords.confirm &&
                  passwords.newPass !== passwords.confirm && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle size={11} /> Passwords do not match
                    </p>
                  )}
              </div>
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <Shield size={16} className="text-[#ff7f11ff] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-neutral-700">
                    Two-Factor Authentication
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <motion.button
                  onClick={() => showToast("2FA setup coming soon!", "info")}
                  whileTap={{ scale: 0.97 }}
                  className="ml-auto px-3 py-1.5 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:border-[#ff7f11ff] hover:text-[#ff7f11ff] transition-colors shrink-0"
                >
                  Enable
                </motion.button>
              </div>
              <motion.button
                onClick={() => {
                  if (
                    passwords.newPass &&
                    passwords.newPass === passwords.confirm
                  ) {
                    setPasswords({ current: "", newPass: "", confirm: "" });
                    showToast("Password updated!", "success");
                  } else {
                    showToast("Check password fields.", "error");
                  }
                }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ff7f11ff] text-white rounded-lg text-sm font-semibold hover:bg-[#e66f00] transition-colors"
              >
                <Key size={14} /> Update Password
              </motion.button>
            </div>
          )}

          {activeSection === "danger" && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-red-500">
                Danger Zone
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Clear All Event Data",
                    desc: "Permanently delete all events and related ticket data.",
                    btn: "Clear Data",
                  },
                  {
                    title: "Reset Analytics",
                    desc: "Reset all analytics and reporting data to zero.",
                    btn: "Reset Analytics",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border border-red-100 rounded-xl bg-red-50/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <motion.button
                      onClick={() =>
                        showToast("Action blocked in demo.", "error")
                      }
                      whileTap={{ scale: 0.95 }}
                      className="ml-4 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors shrink-0"
                    >
                      {item.btn}
                    </motion.button>
                  </div>
                ))}
                <div className="p-4 border border-red-200 rounded-xl bg-red-50/50">
                  <p className="text-sm font-semibold text-red-600 mb-1">
                    Delete Admin Account
                  </p>
                  <p className="text-xs text-neutral-500 mb-3">
                    Type <span className="font-mono font-bold">DELETE</span> to
                    confirm.
                  </p>
                  <input
                    className="w-full border border-red-200 focus:border-red-400 rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none transition-colors mb-3 bg-white"
                    value={danger.confirmText}
                    onChange={(e) => setDanger({ confirmText: e.target.value })}
                    placeholder="Type DELETE"
                  />
                  <motion.button
                    disabled={danger.confirmText !== "DELETE"}
                    onClick={() =>
                      showToast("Demo mode — action blocked.", "error")
                    }
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${danger.confirmText === "DELETE" ? "bg-red-600 text-white hover:bg-red-700" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"}`}
                  >
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Admin Root ───────────────────────────────────────────────────────────────
const Admin = () => {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "users", label: "Users", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const pageTitles = {
    dashboard: "Dashboard",
    events: "Events",
    tickets: "Tickets",
    users: "Users",
    analytics: "Analytics",
    settings: "Settings",
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage setPage={setPage} />;
      case "events":
        return <EventsPage showToast={showToast} />;
      case "tickets":
        return <TicketsPage showToast={showToast} />;
      case "users":
        return <UsersPage showToast={showToast} />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage showToast={showToast} />;
      default:
        return <DashboardPage setPage={setPage} />;
    }
  };

  const SidebarContent = () => (
    <>
      <Link
        to="/"
        className="QurovaDEMO text-[#ff7f11ff] text-2xl px-2 mb-10 block"
      >
        Tixwav
      </Link>
      <p className="text-[9px] text-neutral-300 font-semibold uppercase tracking-widest px-2 mb-2">
        Main Menu
      </p>
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = page === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
                isActive
                  ? "bg-[#ff7f11ff]/10 text-[#ff7f11ff] font-medium"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 + 0.1 }}
              whileHover={{ x: isActive ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon
                size={16}
                className={isActive ? "text-[#ff7f11ff]" : "text-neutral-400"}
              />
              {item.label}
              {isActive && (
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff7f11ff]"
                  layoutId="dot"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
      <div className="border-t border-neutral-100 pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#ff7f11ff]/10 flex items-center justify-center text-[#ff7f11ff] text-xs font-semibold">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-neutral-700 truncate">
              Admin User
            </p>
            <p className="text-[10px] text-neutral-400 truncate">
              admin@tixwav.com
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={15} /> Sign out
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#fffffcff] overflow-hidden font-['Poppins',sans-serif]">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex w-56 shrink-0 border-r border-neutral-100 flex-col py-8 px-4 bg-white"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-neutral-100 z-50 flex flex-col py-8 px-4 lg:hidden"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SidebarContent />
          </motion.aside>
        </>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <motion.div
          className="sticky top-0 z-10 bg-[#fffffcff]/90 backdrop-blur-sm border-b border-neutral-100 px-5 lg:px-8 py-4 flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-neutral-200 text-neutral-500"
            >
              <Menu size={16} />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-neutral-800">
                {pageTitles[page]}
              </h1>
              <p className="text-[10px] text-neutral-400 hidden sm:block">
                Tixwav Admin · April 21, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                placeholder="Search..."
                className="pl-8 pr-4 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#ff7f11ff] bg-white transition-colors w-36"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              className="relative p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:border-[#ff7f11ff] hover:text-[#ff7f11ff] transition-colors"
            >
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ff7f11ff]" />
            </motion.button>
          </div>
        </motion.div>

        <div className="p-5 lg:p-8 max-w-screen-xl">{renderPage()}</div>
      </main>

      <Toast toasts={toasts} />
    </div>
  );
};

export default Admin;
