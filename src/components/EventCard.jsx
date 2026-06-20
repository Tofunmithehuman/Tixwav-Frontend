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
  const ended = event.endDate && new Date(event.endDate) < new Date();

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
        className="@container flex flex-col h-full bg-white border border-neutral-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
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
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/30 to-transparent" />

         
          {event.category && (
            <span className="absolute top-2 right-2 @min-[210px]:top-3 @min-[210px]:right-3 px-1.5 py-0.5 @min-[210px]:px-2.5 @min-[210px]:py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-[8px] @min-[210px]:text-[10px] font-medium">
              {event.category}
            </span>
          )}
          {(ended || soldOut) && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-white text-neutral-800 text-xs font-semibold">
                {ended ? "Ended" : "Sold out"}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 @min-[210px]:p-4">
          <h3 className="text-xs @min-[210px]:text-sm font-semibold text-neutral-800 mb-1 group-hover:text-[#ff7f11] transition-colors line-clamp-2">
            {event.title}
          </h3>
          {(event.organizerName || event.organizer) && (
            <p className="text-[10px] @min-[210px]:text-[11px] text-neutral-400 mb-2 truncate">
              by{" "}
              <span className="text-neutral-600 font-medium">
                {event.organizerName ||
                  event.organizer?.organizerInfo?.companyName ||
                  `${event.organizer?.firstName || ""} ${event.organizer?.lastName || ""}`.trim() ||
                  "Organizer"}
              </span>
            </p>
          )}
          <div className="flex flex-col gap-1.5 mb-3">
            <span className="flex items-center gap-1.5 text-[10px] @min-[210px]:text-[11px] text-neutral-500">
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
            <span className="flex items-center gap-1.5 text-[10px] @min-[210px]:text-[11px] text-neutral-500">
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
          <div className="mt-auto flex flex-col gap-1.5 @min-[210px]:flex-row @min-[210px]:items-center @min-[210px]:justify-between pt-3 border-t border-neutral-100">
            <div className="min-w-0">
              <p className="text-[10px] text-neutral-400 leading-none mb-0.5">
                {price === 0 ? "Entry" : `${tiers.length || 1} ticket type${tiers.length === 1 ? "" : "s"}`}
              </p>
              <p className="text-xs @min-[210px]:text-sm font-semibold text-neutral-800 mt-1">
                {price === 0 ? "Free" : `From ${formatPrice(price)}`}
              </p>
            </div>
            <span className="flex items-center justify-center gap-1 w-full @min-[210px]:w-auto px-3 py-2 @min-[210px]:p-0 rounded-lg @min-[210px]:rounded-none bg-[#ff7f11] @min-[210px]:bg-transparent text-white @min-[210px]:text-[#ff7f11] text-[11px] @min-[210px]:text-xs font-semibold whitespace-nowrap shrink-0 group-hover:gap-2 transition-all">
              Get tickets <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
