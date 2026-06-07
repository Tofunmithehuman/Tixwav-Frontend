import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import * as motion from "motion/react-client";
import { formatPrice, formatDate, minTierPrice } from "@/lib/format";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='225'><rect width='100%' height='100%' fill='%23beb7a4'/></svg>`,
  );

/** Reusable event card used on Home, Discover and Search. */
const EventCard = ({ event, index = 0 }) => {
  const price = minTierPrice(event);
  const to = `/events/${event.slug || event._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 9) * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Link
        to={to}
        className="block bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm group h-full"
      >
        <div className="relative aspect-video overflow-hidden bg-neutral-100">
          <img
            src={event.image || FALLBACK_IMG}
            alt={event.title}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                price === 0
                  ? "bg-emerald-500 text-white"
                  : "bg-white/90 text-neutral-700"
              }`}
            >
              {price === 0 ? "Free" : `From ${formatPrice(price)}`}
            </span>
          </div>
          {event.category && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium">
              {event.category}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-neutral-800 mb-2 group-hover:text-[#ff7f11] transition-colors line-clamp-1">
            {event.title}
          </h3>
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <Calendar size={11} className="text-[#ff7f11]" />
              {formatDate(event.startDate)}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <MapPin size={11} className="text-[#ff7f11]" />
              {event.isOnline ? "Online" : event.venue?.city || "TBA"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
