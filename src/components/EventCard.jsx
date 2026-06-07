import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import { formatPrice, formatDate, minTierPrice } from "@/lib/format";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='%23beb7a4'/></svg>`,
  );

/** Reusable event card used on Home, Discover and Search. Square (1:1) image. */
const EventCard = ({ event, index = 0 }) => {
  const price = minTierPrice(event);
  const to = `/events/${event.slug || event._id}`;
  const tiers = event.ticketTiers || [];
  const soldOut =
    tiers.length > 0 && tiers.every((t) => (t.quantity ?? 0) - (t.sold ?? 0) <= 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 9) * 0.05 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link
        to={to}
        className="flex flex-col h-full bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
      >
        {/* Square media */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={event.image || FALLBACK_IMG}
            alt={event.title}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm ${
              price === 0 ? "bg-emerald-500 text-white" : "bg-white/95 text-neutral-700"
            }`}
          >
            {price === 0 ? "Free" : `From ${formatPrice(price)}`}
          </span>
          {event.category && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-[10px] font-medium">
              {event.category}
            </span>
          )}
          {soldOut && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-white text-neutral-800 text-xs font-semibold">
                Sold out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-sm font-semibold text-neutral-800 mb-1 group-hover:text-[#ff7f11] transition-colors line-clamp-2">
            {event.title}
          </h3>
          {event.organizer && (
            <p className="text-[11px] text-neutral-400 mb-2 truncate">
              by{" "}
              <span className="text-neutral-600 font-medium">
                {event.organizer.organizerInfo?.companyName ||
                  `${event.organizer.firstName || ""} ${event.organizer.lastName || ""}`.trim() ||
                  "Organizer"}
              </span>
            </p>
          )}
          <div className="flex flex-col gap-1.5 mb-3">
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Calendar size={12} className="text-[#ff7f11] shrink-0" />
              {formatDate(event.startDate, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
              {" · "}
              {new Date(event.startDate).toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <MapPin size={12} className="text-[#ff7f11] shrink-0" />
              <span className="truncate">
                {event.isOnline
                  ? "Online event"
                  : [event.venue?.name, event.venue?.city]
                      .filter(Boolean)
                      .join(", ") || "Venue TBA"}
              </span>
            </span>
          </div>

          {/* Footer: price + CTA */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-neutral-100">
            <div>
              <p className="text-[10px] text-neutral-400 leading-none mb-0.5">
                {price === 0 ? "Entry" : `${tiers.length || 1} ticket type${tiers.length === 1 ? "" : "s"}`}
              </p>
              <p className="text-sm font-semibold text-neutral-800">
                {price === 0 ? "Free" : `From ${formatPrice(price)}`}
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#ff7f11] group-hover:gap-2 transition-all">
              Get tickets <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
