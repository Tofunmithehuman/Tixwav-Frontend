import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as motion from "motion/react-client";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ShoppingBag,
  TrendingUp,
  Wallet,
  Ticket,
  Building2,
  Star,
  Trash2,
  Ban,
  RotateCcw,
  Search,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Pagination from "@/components/Pagination";
import {
  fetchAdminOverview,
  fetchAdminRevenue,
  fetchAllUsers,
  fetchAllEvents,
  fetchAllOrders,
  setUserRole,
  toggleUserStatus,
  setEventStatus,
  featureEvent,
  adminDeleteEvent,
  refundOrder,
  selectAdminOverview,
  selectAdminRecentOrders,
  selectAdminRevenue,
  selectAdminUsers,
  selectAdminEvents,
  selectAdminOrders,
  selectAdminUsersPagination,
  selectAdminEventsPagination,
  selectAdminOrdersPagination,
  selectAdminLoading,
} from "@/store/slices/adminSlice";
import { formatNaira, formatDate } from "@/lib/format";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "users", label: "Users", icon: Users },
  { key: "orders", label: "Orders", icon: ShoppingBag },
];

const statusStyles = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-neutral-100 text-neutral-500",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-600",
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-neutral-100 text-neutral-500",
};

const StatCard = ({ icon: Icon, label, value, accent, sub }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-neutral-100 rounded-2xl p-4"
  >
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs text-neutral-400">{label}</span>
      <Icon size={16} className={accent || "text-[#ff7f11]"} />
    </div>
    <p className="text-xl font-semibold text-neutral-800">{value}</p>
    {sub && <p className="text-[11px] text-neutral-400 mt-0.5">{sub}</p>}
  </motion.div>
);

const Loader = () => (
  <div className="h-[30vh] flex items-center justify-center">
    <div className="w-7 h-7 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
  </div>
);
const Empty = ({ label }) => (
  <div className="p-12 text-center text-sm text-neutral-400">{label}</div>
);

// ── Overview ─────────────────────────────────────────────────────────────────
const Overview = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectAdminOverview);
  const revenue = useSelector(selectAdminRevenue);
  const recent = useSelector(selectAdminRecentOrders);

  useEffect(() => {
    dispatch(fetchAdminOverview());
    dispatch(fetchAdminRevenue("30days"));
  }, [dispatch]);

  const maxRev = Math.max(1, ...revenue.map((r) => r.revenue || 0));

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard icon={TrendingUp} label="Total revenue" value={formatNaira(stats?.totalRevenue)} accent="text-emerald-500" />
        <StatCard icon={Wallet} label="Platform (10%)" value={formatNaira(stats?.platformRevenue)} accent="text-[#ff7f11]" sub="Your commission" />
        <StatCard icon={Building2} label="Organizer payouts (90%)" value={formatNaira(stats?.organizerPayouts)} accent="text-purple-500" sub="Settled to organizers" />
        <StatCard icon={Ticket} label="Tickets sold" value={stats?.totalTickets ?? 0} accent="text-blue-500" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Users" value={stats?.totalUsers ?? 0} />
        <StatCard icon={CalendarDays} label="Events" value={stats?.totalEvents ?? 0} />
        <StatCard icon={ShoppingBag} label="Orders" value={stats?.totalOrders ?? 0} />
        <StatCard icon={TrendingUp} label="This month" value={formatNaira(stats?.thisMonthRevenue)} sub={`${stats?.revenueGrowth ?? 0}% vs last month`} />
      </div>

      <div className="bg-white border border-neutral-100 rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-neutral-700 mb-4">Revenue · last 30 days</p>
        {revenue.length === 0 ? (
          <p className="text-sm text-neutral-400 py-8 text-center">No revenue data yet.</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {revenue.map((r, i) => (
              <div
                key={i}
                className="flex-1 bg-[#ff7f11]/80 hover:bg-[#ff7f11] rounded-t transition-all"
                style={{ height: `${((r.revenue || 0) / maxRev) * 100}%` }}
                title={formatNaira(r.revenue)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-neutral-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-neutral-700 mb-3">Recent orders</p>
        {recent.length === 0 ? (
          <p className="text-sm text-neutral-400 py-4">No orders yet.</p>
        ) : (
          <div className="space-y-2">
            {recent.slice(0, 8).map((o) => (
              <div key={o._id} className="flex items-center justify-between text-sm border-b border-neutral-50 last:border-0 pb-2 last:pb-0">
                <div className="min-w-0">
                  <p className="text-neutral-700 truncate">{o.event?.title || "—"}</p>
                  <p className="text-xs text-neutral-400">
                    {o.user ? `${o.user.firstName} ${o.user.lastName}` : o.guestName || "Guest"} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <span className="font-semibold text-neutral-700 shrink-0">{formatNaira(o.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Events ───────────────────────────────────────────────────────────────────
const EventsTab = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectAdminEvents);
  const pagination = useSelector(selectAdminEventsPagination);
  const loading = useSelector(selectAdminLoading);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllEvents({ page, limit: 10 }));
  }, [dispatch, page]);

  const act = (thunk, okMsg) =>
    dispatch(thunk)
      .unwrap()
      .then(() => okMsg && toast.success(okMsg))
      .catch((err) => toast.error(err || "Action failed."));

  return loading && events.length === 0 ? (
    <Loader />
  ) : (
    <>
    <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-neutral-400 border-b border-neutral-100">
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Organizer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Revenue</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev._id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {ev.featured && <Star size={13} className="text-[#ff7f11] fill-[#ff7f11]" />}
                    <span className="font-medium text-neutral-700 line-clamp-1">{ev.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {ev.organizer?.organizerInfo?.companyName ||
                    (ev.organizer ? `${ev.organizer.firstName} ${ev.organizer.lastName}` : "—")}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusStyles[ev.status] || ""}`}>
                    {ev.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">{formatNaira(ev.totalRevenue)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      title={ev.featured ? "Unfeature" : "Feature"}
                      onClick={() => act(featureEvent({ id: ev._id, featured: !ev.featured }))}
                      className={`p-1.5 rounded-lg hover:bg-neutral-100 ${ev.featured ? "text-[#ff7f11]" : "text-neutral-400 hover:text-[#ff7f11]"}`}
                    >
                      <Star size={15} />
                    </button>
                    {ev.status === "cancelled" ? (
                      <button
                        title="Reinstate"
                        onClick={() => act(setEventStatus({ id: ev._id, status: "draft" }), "Event reinstated")}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-500 hover:bg-neutral-100"
                      >
                        <RotateCcw size={15} />
                      </button>
                    ) : (
                      <button
                        title="Disable (cancel)"
                        onClick={() => act(setEventStatus({ id: ev._id, status: "cancelled" }), "Event disabled")}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-neutral-100"
                      >
                        <Ban size={15} />
                      </button>
                    )}
                    <button
                      title="Delete"
                      onClick={() => {
                        if (window.confirm(`Delete "${ev.title}"?`))
                          act(adminDeleteEvent(ev._id), "Event deleted");
                      }}
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
      {events.length === 0 && <Empty label="No events" />}
    </div>
    <Pagination page={page} pages={pagination?.pages} total={pagination?.total} onPage={setPage} />
    </>
  );
};

// ── Users ────────────────────────────────────────────────────────────────────
const UsersTab = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers);
  const pagination = useSelector(selectAdminUsersPagination);
  const loading = useSelector(selectAdminLoading);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search term for real-time search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    dispatch(fetchAllUsers({ search: debouncedQ || undefined, page, limit: 10 }));
  }, [dispatch, debouncedQ, page]);

  const onSearch = (v) => {
    setQ(v);
    setPage(1); // new query → back to first page
  };

  return (
    <div>
      <div className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11] rounded-lg px-3 bg-white mb-4 max-w-sm">
        <Search size={14} className="text-neutral-400 shrink-0" />
        <input
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search users"
          className="py-2 px-2 text-base focus:outline-none bg-transparent flex-1 min-w-0"
        />
      </div>

      {loading && users.length === 0 ? (
        <Loader />
      ) : (
        <>
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-neutral-400 border-b border-neutral-100">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                    <td className="px-4 py-3">
                      <p className="text-neutral-700">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-neutral-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          dispatch(setUserRole({ id: u._id, role: e.target.value }))
                            .unwrap()
                            .then(() => toast.success("Role updated"))
                            .catch((err) => toast.error(err))
                        }
                        className="border border-neutral-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#ff7f11] capitalize"
                      >
                        <option value="user">user</option>
                        <option value="organizer">organizer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                        {u.isActive ? "active" : "suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          dispatch(toggleUserStatus(u._id))
                            .unwrap()
                            .then((d) => toast.success(d.isActive ? "Activated" : "Suspended"))
                            .catch((err) => toast.error(err))
                        }
                        className={`text-xs font-medium ${u.isActive ? "text-red-500 hover:text-red-600" : "text-emerald-600 hover:text-emerald-700"}`}
                      >
                        {u.isActive ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && <Empty label="No users" />}
        </div>
        <Pagination page={page} pages={pagination?.pages} total={pagination?.total} onPage={setPage} />
        </>
      )}
    </div>
  );
};

// ── Orders ───────────────────────────────────────────────────────────────────
const OrdersTab = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);
  const pagination = useSelector(selectAdminOrdersPagination);
  const loading = useSelector(selectAdminLoading);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: 10 }));
  }, [dispatch, page]);

  const refund = (o) => {
    if (!window.confirm(`Refund order ${o.orderRef}?`)) return;
    dispatch(refundOrder({ id: o._id, reason: "Admin refund" }))
      .unwrap()
      .then(() => toast.success("Order refunded"))
      .catch((err) => toast.error(err || "Refund failed"));
  };

  return loading && orders.length === 0 ? (
    <Loader />
  ) : (
    <>
    <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-neutral-400 border-b border-neutral-100">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{o.orderRef}</td>
                <td className="px-4 py-3 text-neutral-600 line-clamp-1">{o.event?.title || "—"}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {o.user ? `${o.user.firstName} ${o.user.lastName}` : o.guestName || "Guest"}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-700">{formatNaira(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusStyles[o.status] || ""}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {o.status === "confirmed" ? (
                    <button onClick={() => refund(o)} className="text-xs font-medium text-red-500 hover:text-red-600">
                      Refund
                    </button>
                  ) : (
                    <span className="text-xs text-neutral-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && <Empty label="No orders" />}
    </div>
    <Pagination page={page} pages={pagination?.pages} total={pagination?.total} onPage={setPage} />
    </>
  );
};

const Admin = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Admin dashboard</h1>
          <p className="text-sm text-neutral-400 mb-6">
            Platform overview, organizer payouts (90/10), events, users & orders.
          </p>

          <div className="flex gap-1 mb-6 border-b border-neutral-100 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                  tab === t.key
                    ? "border-[#ff7f11] text-[#ff7f11]"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && <Overview />}
          {tab === "events" && <EventsTab />}
          {tab === "users" && <UsersTab />}
          {tab === "orders" && <OrdersTab />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
