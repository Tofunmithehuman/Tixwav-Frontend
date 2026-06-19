import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search as SearchIcon, X } from "lucide-react";
import * as motion from "motion/react-client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import EventCard from "@/components/EventCard";
import {
  fetchEvents,
  selectEvents,
  selectEventsLoading,
} from "@/store/slices/eventSlice";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const loading = useSelector(selectEventsLoading);
  const [term, setTerm] = useState(params.get("q") || "");

  const query = params.get("q") || "";

  // Keep the input in sync with the URL (e.g. browser back/forward)
  useEffect(() => {
    setTerm(query);
  }, [query]);

  // Real-time search: debounce the input and reflect it in the URL (replace, so
  // we don't spam browser history). The fetch effect below reacts to the URL.
  useEffect(() => {
    const t = setTimeout(() => {
      const next = term.trim();
      if (next !== query) setParams(next ? { q: next } : {}, { replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [term, query, setParams]);

  useEffect(() => {
    // Search published events (server-side) whenever the URL query changes
    dispatch(fetchEvents(query ? { search: query, limit: 24 } : { limit: 24 }));
  }, [dispatch, query]);

  const submit = (e) => {
    e.preventDefault();
    const next = term.trim();
    setParams(next ? { q: next } : {}, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />

      <section className="px-4 md:px-8 pt-8 pb-6 border-b border-neutral-100 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-4">
            Search events
          </h1>
          <form onSubmit={submit} className="flex gap-2 max-w-2xl">
            <div className="flex-1 min-w-0 flex items-center border border-neutral-200 focus-within:border-[#ff7f11] rounded-lg px-3 sm:px-4 bg-white transition-colors">
              <SearchIcon size={16} className="text-neutral-400 shrink-0" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search events, topics, tags…"
                className="flex-1 min-w-0 py-3 px-2 sm:px-3 text-base text-neutral-600 focus:outline-none bg-transparent placeholder:text-neutral-300"
              />
              {term && (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  className="text-neutral-300 hover:text-neutral-500 shrink-0"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button className="shrink-0 bg-[#ff7f11] text-white px-4 sm:px-6 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-screen-xl mx-auto">
          {query && (
            <p className="text-xs text-neutral-400 mb-5">
              Results for{" "}
              <span className="font-semibold text-neutral-700">“{query}”</span>
            </p>
          )}

          {loading ? (
            <div className="h-[30vh] flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <SearchIcon size={22} className="text-neutral-300" />
              </div>
              <p className="text-sm font-medium text-neutral-500">
                {query ? "No events match your search" : "Start typing to find events"}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {events.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Search;
