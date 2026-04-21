import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import * as motion from "motion/react-client";
import { Search, SlidersHorizontal, MapPin, Calendar, Tag, X, ChevronDown } from "lucide-react";

const allEvents = [
  { id: 1, title: "Design Systems Meetup", category: "Design", date: "Apr 28, 2026", location: "Lagos", price: 0, image: "https://avatar.vercel.sh/ds1", tags: ["UI", "Components"] },
  { id: 2, title: "React Conference 2026", category: "Tech", date: "May 10, 2026", location: "Abuja", price: 25000, image: "https://avatar.vercel.sh/rc2", tags: ["React", "Frontend"] },
  { id: 3, title: "Web Performance Workshop", category: "Workshop", date: "May 3, 2026", location: "Lagos", price: 15000, image: "https://avatar.vercel.sh/wp3", tags: ["Speed", "Core Web Vitals"] },
  { id: 4, title: "AI & Machine Learning Summit", category: "Tech", date: "Jun 1, 2026", location: "Port Harcourt", price: 25000, image: "https://avatar.vercel.sh/ai4", tags: ["AI", "ML"] },
  { id: 5, title: "JavaScript Masterclass", category: "Workshop", date: "Jun 7, 2026", location: "Lagos", price: 20000, image: "https://avatar.vercel.sh/jm5", tags: ["JS", "Advanced"] },
  { id: 6, title: "UX Design Bootcamp", category: "Design", date: "Jun 14, 2026", location: "Lagos", price: 40000, image: "https://avatar.vercel.sh/ux6", tags: ["UX", "Research"] },
  { id: 7, title: "Startup Weekend Lagos", category: "Business", date: "Jul 4, 2026", location: "Lagos", price: 0, image: "https://avatar.vercel.sh/sw7", tags: ["Startup", "Pitch"] },
  { id: 8, title: "DevOps & Cloud Summit", category: "Tech", date: "Jul 18, 2026", location: "Abuja", price: 30000, image: "https://avatar.vercel.sh/dc8", tags: ["DevOps", "Cloud"] },
  { id: 9, title: "Product Management Workshop", category: "Business", date: "Aug 2, 2026", location: "Lagos", price: 18000, image: "https://avatar.vercel.sh/pm9", tags: ["Product", "Strategy"] },
];

const categories = ["All", "Tech", "Design", "Workshop", "Business"];
const locations = ["All", "Lagos", "Abuja", "Port Harcourt"];

const fmt = (n) => (n === 0 ? "Free" : `₦${Number(n).toLocaleString("en-NG")}`);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Discover = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("date");

  const filtered = allEvents
    .filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "All" || e.category === category;
      const matchLoc = location === "All" || e.location === location;
      return matchSearch && matchCat && matchLoc;
    })
    .sort((a, b) =>
      sort === "price-asc"
        ? a.price - b.price
        : sort === "price-desc"
          ? b.price - a.price
          : a.date.localeCompare(b.date),
    );

  const activeFilterCount = (category !== "All" ? 1 : 0) + (location !== "All" ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffcff] font-['Poppins',sans-serif]">
      <Navigation />

      {/* Hero */}
      <motion.section
        className="bg-white border-b border-neutral-100 px-4 md:px-8 pt-10 pb-8"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-xl mx-auto">
          <motion.p
            className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Browse Events
          </motion.p>
          <motion.h1
            className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Discover what's happening
          </motion.h1>
          <motion.p
            className="text-sm text-neutral-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {allEvents.length} events across Nigeria — find yours.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
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
                <button onClick={() => setSearch("")} className="text-neutral-300 hover:text-neutral-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${showFilters || activeFilterCount > 0 ? "border-[#ff7f11] text-[#ff7f11] bg-[#ff7f11]/5" : "border-neutral-200 text-neutral-500 bg-white"}`}
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#ff7f11] text-white text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </motion.div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {/* Category */}
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag size={10} /> Category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${category === c ? "bg-[#ff7f11] text-white" : "border border-neutral-200 text-neutral-500 hover:border-[#ff7f11] hover:text-[#ff7f11]"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin size={10} /> Location
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {locations.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocation(l)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${location === l ? "bg-[#ff7f11] text-white" : "border border-neutral-200 text-neutral-500 hover:border-[#ff7f11] hover:text-[#ff7f11]"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Sort by</p>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-600 focus:outline-none focus:border-[#ff7f11] appearance-none bg-white cursor-pointer"
                  >
                    <option value="date">Date (Earliest)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
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
              <span className="font-semibold text-neutral-700">{filtered.length}</span> event{filtered.length !== 1 ? "s" : ""} found
            </p>
            {(category !== "All" || location !== "All" || search) && (
              <button
                onClick={() => { setCategory("All"); setLocation("All"); setSearch(""); }}
                className="text-xs text-[#ff7f11] hover:underline flex items-center gap-1"
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <Search size={22} className="text-neutral-300" />
              </div>
              <p className="text-sm font-medium text-neutral-500">No events match your search</p>
              <p className="text-xs text-neutral-300 mt-1">Try adjusting your filters or search terms</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${event.price === 0 ? "bg-emerald-500 text-white" : "bg-white/90 text-neutral-700"}`}>
                        {fmt(event.price)}
                      </span>
                    </div>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium">
                      {event.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-neutral-800 mb-2 group-hover:text-[#ff7f11] transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="flex flex-col gap-1.5 mb-3">
                      <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                        <Calendar size={11} className="text-[#ff7f11]" /> {event.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                        <MapPin size={11} className="text-[#ff7f11]" /> {event.location}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap mb-4">
                      {event.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] text-neutral-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-2.5 bg-[#ff7f11] text-white text-xs font-semibold rounded-lg hover:bg-[#e66f00] transition-colors"
                    >
                      Get Tickets
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Discover;