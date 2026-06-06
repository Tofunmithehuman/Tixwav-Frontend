import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import EventCard from "@/components/EventCard";
import * as motion from "motion/react-client";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Tag,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchEvents,
  selectEvents,
  selectEventsPagination,
  selectEventsLoading,
} from "@/store/slices/eventSlice";

const categories = [
  "All", "Tech", "Design", "Workshop", "Business", "Music", "Sports", "Food", "Arts", "Other",
];
const sorts = [
  { value: "startDate", label: "Date (soonest)" },
  { value: "-createdAt", label: "Newest" },
  { value: "-views", label: "Most popular" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const Discover = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const pagination = useSelector(selectEventsPagination);
  const loading = useSelector(selectEventsLoading);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("startDate");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce the free-text search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [debounced, category, city, sort]);

  useEffect(() => {
    dispatch(
      fetchEvents({
        search: debounced,
        category,
        city: city.trim(),
        sort,
        page,
        limit: 12,
      }),
    );
  }, [dispatch, debounced, category, city, sort, page]);

  const activeFilterCount = (category !== "All" ? 1 : 0) + (city ? 1 : 0);
  const total = pagination?.total ?? events.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffcff]">
      <Navigation />

      {/* Hero */}
      <motion.section
        className="bg-white border-b border-neutral-100 px-4 md:px-8 pt-10 pb-8"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-xl mx-auto">
          <p className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-2">
            Browse Events
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-1">
            Discover what's happening
          </h1>
          <p className="text-sm text-neutral-400 mb-6">
            Find events across Nigeria — and beyond.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center border border-neutral-200 focus-within:border-[#ff7f11] rounded-lg px-4 bg-white transition-colors">
              <Search size={15} className="text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search events, topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 py-3 px-3 text-sm text-neutral-600 focus:outline-none bg-transparent placeholder:text-neutral-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-neutral-300 hover:text-neutral-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? "border-[#ff7f11] text-[#ff7f11] bg-[#ff7f11]/5"
                  : "border-neutral-200 text-neutral-500 bg-white"
              }`}
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#ff7f11] text-white text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag size={10} /> Category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        category === c
                          ? "bg-[#ff7f11] text-white"
                          : "border border-neutral-200 text-neutral-500 hover:border-[#ff7f11] hover:text-[#ff7f11]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin size={10} /> City
                </p>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-600 focus:outline-none focus:border-[#ff7f11]"
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Sort by
                </p>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-600 focus:outline-none focus:border-[#ff7f11] appearance-none bg-white cursor-pointer"
                  >
                    {sorts.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Results */}
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs text-neutral-400">
              <span className="font-semibold text-neutral-700">{total}</span> event
              {total !== 1 ? "s" : ""} found
            </p>
            {(category !== "All" || city || search) && (
              <button
                onClick={() => {
                  setCategory("All");
                  setCity("");
                  setSearch("");
                }}
                className="text-xs text-[#ff7f11] hover:underline flex items-center gap-1"
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="h-[30vh] flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <Search size={22} className="text-neutral-300" />
              </div>
              <p className="text-sm font-medium text-neutral-500">
                No events match your search
              </p>
              <p className="text-xs text-neutral-300 mt-1">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {events.map((event, i) => (
                  <EventCard key={event._id} event={event} index={i} />
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination?.pages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-600 disabled:opacity-40 hover:border-[#ff7f11] hover:text-[#ff7f11]"
                  >
                    <ChevronLeft size={15} /> Prev
                  </button>
                  <span className="text-sm text-neutral-500">
                    {page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-600 disabled:opacity-40 hover:border-[#ff7f11] hover:text-[#ff7f11]"
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Discover;
