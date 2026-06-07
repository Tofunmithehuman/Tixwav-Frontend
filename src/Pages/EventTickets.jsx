import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, Ban, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import {
  fetchEventTickets,
  cancelTicket,
  selectEventTickets,
  selectTicketsPagination,
  selectTicketsLoading,
} from "@/store/slices/ticketSlice";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  used: "bg-blue-100 text-blue-600",
  cancelled: "bg-red-100 text-red-600",
  refunded: "bg-neutral-100 text-neutral-500",
};

const EventTickets = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tickets = useSelector(selectEventTickets);
  const pagination = useSelector(selectTicketsPagination);
  const loading = useSelector(selectTicketsLoading);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search term for real-time, server-side search across all pages
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    dispatch(
      fetchEventTickets({
        eventId: id,
        page,
        limit: 20,
        search: debouncedSearch || undefined,
      }),
    );
  }, [dispatch, id, page, debouncedSearch]);

  const onSearch = (v) => {
    setSearch(v);
    setPage(1);
  };

  const disable = (code) => {
    if (!window.confirm(`Disable ticket ${code}? The holder won't be able to check in.`))
      return;
    dispatch(cancelTicket(code))
      .unwrap()
      .then(() => toast.success("Ticket disabled."))
      .catch((err) => toast.error(err || "Could not disable ticket."));
  };

  const total = pagination?.total ?? tickets.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-screen-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#ff7f11] mb-4"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl font-semibold text-neutral-800">Attendees</h1>
              <p className="text-xs text-neutral-400">
                {total} ticket{total !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center border border-neutral-200 focus-within:border-[#ff7f11] rounded-lg px-3 bg-white">
              <Search size={14} className="text-neutral-400" />
              <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search name, email, code"
                className="py-2 px-2 text-base focus:outline-none bg-transparent w-52"
              />
            </div>
          </div>

          {loading ? (
            <div className="h-[30vh] flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white border border-neutral-100 rounded-2xl p-12 text-center text-sm text-neutral-400">
              No tickets {debouncedSearch ? "match your search" : "sold yet"}.
            </div>
          ) : (
            <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-neutral-400 border-b border-neutral-100">
                      <th className="px-4 py-3 font-medium">Code</th>
                      <th className="px-4 py-3 font-medium">Holder</th>
                      <th className="px-4 py-3 font-medium">Tier</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr
                        key={t._id || t.ticketCode}
                        className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                      >
                        <td className="px-4 py-3 font-medium text-[#ff7f11] tracking-wide">
                          {t.ticketCode}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-neutral-700">{t.holder?.name}</p>
                          <p className="text-xs text-neutral-400">{t.holder?.email}</p>
                        </td>
                        <td className="px-4 py-3 text-neutral-500">{t.tierName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusStyles[t.status] || "bg-neutral-100 text-neutral-500"}`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {t.status === "active" ? (
                            <button
                              onClick={() => disable(t.ticketCode)}
                              className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                            >
                              <Ban size={13} /> Disable
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
            </div>
          )}
          <Pagination page={page} pages={pagination?.pages} total={pagination?.total} onPage={setPage} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventTickets;
