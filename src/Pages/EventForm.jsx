import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, Plus, Trash2, ImageIcon } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SearchableSelect from "@/components/SearchableSelect";
import {
  createEvent,
  updateEvent,
  fetchEvent,
  selectCurrentEvent,
  selectEventMutating,
} from "@/store/slices/eventSlice";

const CATEGORIES = [
  "Tech", "Design", "Workshop", "Business", "Music", "Sports", "Food", "Arts",
  "Concert", "Festival", "Conference", "Comedy", "Theatre", "Film", "Party",
  "Networking", "Religious", "Health", "Education", "Fashion", "Gaming",
  "Charity", "Sports & Fitness", "Other",
];

const emptyTier = () => ({ name: "", price: "", quantity: "", description: "" });

// datetime-local needs "YYYY-MM-DDTHH:mm"
const toLocalInput = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
};

const EventForm = ({ mode = "create" }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = useSelector(selectCurrentEvent);
  const saving = useSelector(selectEventMutating);

  const [form, setForm] = useState({
    title: "",
    category: "Other",
    organizerName: "",
    description: "",
    isOnline: false,
    onlineLink: "",
    venueName: "",
    venueAddress: "",
    venueCity: "",
    venueState: "",
    startDate: "",
    endDate: "",
    tags: "",
    requiresVerification: true,
  });
  const [tiers, setTiers] = useState([emptyTier()]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (mode === "edit" && id) dispatch(fetchEvent(id));
  }, [mode, id, dispatch]);

  // Prefill on edit
  useEffect(() => {
    if (mode === "edit" && current && current._id) {
      setForm({
        title: current.title || "",
        category: current.category || "Other",
        organizerName: current.organizerName || "",
        description: current.description || "",
        isOnline: !!current.isOnline,
        onlineLink: current.onlineLink || "",
        venueName: current.venue?.name || "",
        venueAddress: current.venue?.address || "",
        venueCity: current.venue?.city || "",
        venueState: current.venue?.state || "",
        startDate: toLocalInput(current.startDate),
        endDate: toLocalInput(current.endDate),
        tags: (current.tags || []).join(", "),
        requiresVerification: current.requiresVerification ?? true,
      });
      if (current.ticketTiers?.length)
        setTiers(
          current.ticketTiers.map((t) => ({
            name: t.name,
            price: t.price,
            quantity: t.quantity,
            description: t.description || "",
          })),
        );
      if (current.image) setImagePreview(current.image);
    }
  }, [mode, current]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setTier = (i, k, v) =>
    setTiers((p) => p.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)));

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.title.trim()) return "Add an event title.";
    if (!form.description.trim()) return "Add a description.";
    if (!form.startDate || !form.endDate) return "Set start and end dates.";
    if (new Date(form.endDate) <= new Date(form.startDate))
      return "End date must be after the start date.";
    if (!form.isOnline && !form.venueCity.trim())
      return "Add the venue city (or mark the event as online).";
    const cleanTiers = tiers.filter((t) => t.name.trim());
    if (cleanTiers.length === 0) return "Add at least one ticket tier.";
    for (const t of cleanTiers) {
      if (t.price === "" || Number(t.price) < 0) return `Set a valid price for "${t.name}".`;
      if (!t.quantity || Number(t.quantity) < 1) return `Set a quantity for "${t.name}".`;
    }
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.warning(err);

    const cleanTiers = tiers
      .filter((t) => t.name.trim())
      .map((t) => ({
        name: t.name.trim(),
        price: Number(t.price),
        quantity: Number(t.quantity),
        description: t.description?.trim() || undefined,
      }));

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("category", form.category);
    fd.append("organizerName", form.organizerName.trim());
    fd.append("description", form.description.trim());
    fd.append("isOnline", String(form.isOnline));
    if (form.isOnline) fd.append("onlineLink", form.onlineLink.trim());
    fd.append(
      "venue",
      JSON.stringify({
        name: form.venueName,
        address: form.venueAddress,
        city: form.venueCity,
        state: form.venueState,
      }),
    );
    fd.append("startDate", new Date(form.startDate).toISOString());
    fd.append("endDate", new Date(form.endDate).toISOString());
    fd.append(
      "tags",
      JSON.stringify(
        form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      ),
    );
    fd.append("ticketTiers", JSON.stringify(cleanTiers));
    fd.append("requiresVerification", String(form.requiresVerification));
    if (imageFile) fd.append("image", imageFile);

    try {
      if (mode === "edit") {
        await dispatch(updateEvent({ id, formData: fd })).unwrap();
        toast.success("Event updated.");
      } else {
        const res = await dispatch(createEvent(fd)).unwrap();
        toast.success(res?.message || "Event created.");
      }
      navigate("/organizer");
    } catch (er) {
      toast.error(typeof er === "string" ? er : "Could not save the event.");
    }
  };

  const inputCls =
    "w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7f11]";
  const labelCls = "text-xs font-semibold text-neutral-600";

  return (
    <div className="min-h-screen flex flex-col bg-[#fffffc]">
      <Navigation />
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/organizer")}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#ff7f11] mb-4"
          >
            <ArrowLeft size={15} /> Dashboard
          </button>
          <h1 className="text-2xl font-semibold text-neutral-800 mb-6">
            {mode === "edit" ? "Edit event" : "Create event"}
          </h1>

          <form onSubmit={submit} className="space-y-5">
            {/* Cover image */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5">
              <label className={labelCls}>COVER IMAGE</label>
              <label className="mt-2 block aspect-video rounded-xl border-2 border-dashed border-neutral-200 hover:border-[#ff7f11] cursor-pointer overflow-hidden relative transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                    <ImageIcon size={26} />
                    <span className="text-xs mt-2">Click to upload (JPG/PNG/WebP)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onImage}
                  className="hidden"
                />
              </label>
            </div>

            {/* Basics */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 space-y-4">
              <div>
                <label className={labelCls}>EVENT TITLE</label>
                <input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Afrobeats Night Lagos"
                />
              </div>
              <div>
                <label className={labelCls}>CATEGORY</label>
                <div className="mt-1">
                  <SearchableSelect
                    value={form.category}
                    onChange={(v) => setField("category", v)}
                    options={CATEGORIES}
                    placeholder="Select a category"
                    ariaLabel="Event category"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>HOST / ORGANIZER NAME (OPTIONAL)</label>
                <input
                  value={form.organizerName}
                  onChange={(e) => setField("organizerName", e.target.value)}
                  className={inputCls}
                  placeholder="Leave blank to use your account name"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Set this when you're organizing on behalf of someone else.
                </p>
              </div>
              <div>
                <label className={labelCls}>DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder="What's the event about?"
                />
              </div>
              <div>
                <label className={labelCls}>TAGS (comma separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setField("tags", e.target.value)}
                  className={inputCls}
                  placeholder="music, live, lagos"
                />
              </div>
            </div>

            {/* When & where */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>STARTS</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>ENDS</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={(e) => setField("isOnline", e.target.checked)}
                  className="accent-[#ff7f11]"
                />
                This is an online event
              </label>

              {form.isOnline ? (
                <div>
                  <label className={labelCls}>ONLINE LINK</label>
                  <input
                    value={form.onlineLink}
                    onChange={(e) => setField("onlineLink", e.target.value)}
                    className={inputCls}
                    placeholder="https://meet…"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>VENUE NAME</label>
                    <input
                      value={form.venueName}
                      onChange={(e) => setField("venueName", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>CITY</label>
                    <input
                      value={form.venueCity}
                      onChange={(e) => setField("venueCity", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>ADDRESS</label>
                    <input
                      value={form.venueAddress}
                      onChange={(e) => setField("venueAddress", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>STATE</label>
                    <input
                      value={form.venueState}
                      onChange={(e) => setField("venueState", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Ticket tiers */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <label className={labelCls}>TICKET TIERS</label>
                <button
                  type="button"
                  onClick={() => setTiers((p) => [...p, emptyTier()])}
                  className="flex items-center gap-1 text-xs text-[#ff7f11] font-medium hover:underline"
                >
                  <Plus size={13} /> Add tier
                </button>
              </div>
              <div className="space-y-3">
                {tiers.map((t, i) => (
                  <div key={i} className="border border-neutral-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-neutral-500">
                        Tier {i + 1}
                      </span>
                      {tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setTiers((p) => p.filter((_, idx) => idx !== i))
                          }
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        placeholder="Name (e.g. VIP)"
                        value={t.name}
                        onChange={(e) => setTier(i, "name", e.target.value)}
                        className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ff7f11]"
                      />
                      <input
                        placeholder="Price (₦, 0 = free)"
                        inputMode="numeric"
                        value={t.price}
                        onChange={(e) =>
                          setTier(i, "price", e.target.value.replace(/[^\d]/g, ""))
                        }
                        className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ff7f11]"
                      />
                      <input
                        placeholder="Quantity"
                        inputMode="numeric"
                        value={t.quantity}
                        onChange={(e) =>
                          setTier(i, "quantity", e.target.value.replace(/[^\d]/g, ""))
                        }
                        className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ff7f11]"
                      />
                    </div>
                    <input
                      placeholder="Short description (optional)"
                      value={t.description}
                      onChange={(e) => setTier(i, "description", e.target.value)}
                      className="w-full mt-2 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ff7f11]"
                    />
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-600 mt-4">
                <input
                  type="checkbox"
                  checked={form.requiresVerification}
                  onChange={(e) => setField("requiresVerification", e.target.checked)}
                  className="accent-[#ff7f11]"
                />
                Require QR check-in at the door
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#ff7f11] text-white py-3 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : mode === "edit" ? (
                "Save changes"
              ) : (
                "Create event"
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventForm;
