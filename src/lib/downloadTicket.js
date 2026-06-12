import api from "./api";

/**
 * Download a ticket PDF in a way that works on mobile browsers.
 *
 * The trick: open the new tab *synchronously* inside the click handler (so it
 * counts as a user gesture and isn't popup-blocked), then point it at the PDF
 * once the URL comes back. Falls back to navigating the current tab.
 *
 * @param {string} ticketCode
 * @param {string} [email]  guest email, when the buyer isn't logged in
 */
export async function downloadTicketPdf(ticketCode, email) {
  const win = typeof window !== "undefined" ? window.open("", "_blank") : null;
  try {
    const q = email ? `?email=${encodeURIComponent(email)}` : "";
    const { data } = await api.get(`/tickets/${ticketCode}/download${q}`);
    const url = data?.downloadUrl;
    if (!url) throw new Error("PDF not ready");
    if (win) win.location.href = url;
    else window.location.href = url;
    return true;
  } catch (err) {
    if (win) win.close();
    throw err;
  }
}
