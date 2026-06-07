// Shared formatting helpers (Naira + dates) used across the app.

// "Free" when zero, otherwise ₦-formatted. Use for ticket prices.
export const formatPrice = (n) =>
  !n || Number(n) === 0 ? "Free" : `₦${Number(n).toLocaleString("en-NG")}`;

// Always shows the ₦ amount (₦0 included). Use for revenue/totals.
export const formatNaira = (n) => `₦${Number(n || 0).toLocaleString("en-NG")}`;

export const formatDate = (d, opts) =>
  d
    ? new Date(d).toLocaleDateString(
        "en-NG",
        opts || { year: "numeric", month: "short", day: "numeric" },
      )
    : "";

export const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

// Lowest tier price for an event (for "from ₦x" display)
export const minTierPrice = (event) => {
  if (!event?.ticketTiers?.length) return 0;
  return Math.min(...event.ticketTiers.map((t) => t.price ?? 0));
};
