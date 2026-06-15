import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Check } from "lucide-react";

// Accept either ["a","b"] or [{ value, label }] and normalise to objects.
const normalize = (options) =>
  (options || []).map((o) =>
    o !== null && typeof o === "object"
      ? { value: o.value, label: String(o.label ?? o.value) }
      : { value: o, label: String(o) },
  );

/**
 * A clean, brand-styled dropdown that replaces native <select> across the site.
 * - Type-to-filter (search appears automatically once the list is long enough)
 * - Keyboard navigable (↑/↓/Enter/Esc) and closes on outside-click
 * - Rendered in a portal with fixed positioning so it is never clipped by a
 *   table cell, card, or scroll container, and never overflows the viewport.
 *
 * Props:
 *   value, onChange(value), options (strings or {value,label}),
 *   placeholder, searchable (auto when omitted), disabled, loading,
 *   size ("sm" | "md"), className (extra trigger classes), ariaLabel
 */
const SearchableSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  searchable,
  disabled = false,
  loading = false,
  size = "md",
  className = "",
  ariaLabel,
}) => {
  const opts = useMemo(() => normalize(options), [options]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    width: 0,
    openUp: false,
  });

  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const optionRefs = useRef([]);
  const listId = useId();

  const selected = opts.find((o) => o.value === value);
  const showSearch = searchable ?? opts.length > 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return opts;
    const terms = q.split(/\s+/).filter(Boolean);
    const scored = [];
    for (const o of opts) {
      const label = o.label.toLowerCase();
      // Every typed term must appear in the label (supports letters + words).
      if (!terms.every((t) => label.includes(t))) continue;
      // Rank: 0 = label starts with the query, 1 = a word starts with the
      // first term, 2 = matches elsewhere. Lower ranks first.
      let rank = 2;
      if (label.startsWith(q)) rank = 0;
      else if (label.split(/\s+/).some((w) => w.startsWith(terms[0]))) rank = 1;
      scored.push({ o, rank, pos: label.indexOf(terms[0]), len: label.length });
    }
    return scored
      .sort((a, b) => a.rank - b.rank || a.pos - b.pos || a.len - b.len)
      .map((x) => x.o);
  }, [opts, query]);

  // Position the floating panel under (or above, if cramped) the trigger.
  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.max(r.width, 160);
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < 280 && r.top > spaceBelow;
    let left = r.left;
    const maxLeft = window.innerWidth - width - 8;
    if (left > maxLeft) left = Math.max(8, maxLeft);
    setCoords({ top: r.top, bottom: r.bottom, left, width, openUp });
  };

  useLayoutEffect(() => {
    if (!open) return;
    place();
    const onMove = () => place();
    // capture:true so we catch scrolls inside any ancestor container too
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  // On open: preselect the current value and move focus into the panel.
  useEffect(() => {
    if (open) {
      setActiveIndex(Math.max(0, filtered.findIndex((o) => o.value === value)));
      const t = setTimeout(() => {
        if (showSearch) searchRef.current?.focus();
        else panelRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
    setQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Outside-click closes.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the keyboard-highlighted option scrolled into view.
  useEffect(() => {
    if (open && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  const choose = (opt) => {
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (!open) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return; // let Enter/Space trigger the button's native click to open
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) choose(filtered[activeIndex]);
    }
  };

  const triggerPad = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-2.5 text-sm";

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => !disabled && !loading && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={`flex items-center justify-between gap-2 w-full bg-white border rounded-lg text-left transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${triggerPad} ${
          open
            ? "border-[#ff7f11]"
            : "border-neutral-200 hover:border-neutral-300"
        } ${className}`}
    >
        <span
          className={`truncate ${selected ? "text-neutral-700" : "text-neutral-400"}`}
        >
          {loading ? "Loading…" : selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={size === "sm" ? 13 : 16}
          className={`shrink-0 text-neutral-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            style={{
              position: "fixed",
              top: coords.openUp ? undefined : coords.bottom + 6,
              bottom: coords.openUp
                ? window.innerHeight - coords.top + 6
                : undefined,
              left: coords.left,
              width: coords.width,
              zIndex: 1000,
            }}
            className="bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden focus:outline-none"
          >
            {showSearch && (
              <div className="flex items-center gap-2 px-3 border-b border-neutral-100">
                <Search size={14} className="text-neutral-400 shrink-0" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search…"
                  className="flex-1 min-w-0 py-2.5 text-base sm:text-sm text-neutral-700 focus:outline-none bg-transparent placeholder:text-neutral-300"
                />
              </div>
            )}
            <ul
              role="listbox"
              id={listId}
              className="max-h-60 overflow-y-auto py-1 overscroll-contain"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-3 text-sm text-neutral-400 text-center">
                  No matches
                </li>
              ) : (
                filtered.map((o, i) => {
                  const isSelected = o.value === value;
                  const isActive = i === activeIndex;
                  return (
                    <li
                      key={o.value}
                      role="option"
                      aria-selected={isSelected}
                      ref={(el) => (optionRefs.current[i] = el)}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => choose(o)}
                      className={`flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer ${
                        isActive ? "bg-[#ff7f11]/10" : ""
                      } ${
                        isSelected
                          ? "text-[#ff7f11] font-medium"
                          : "text-neutral-700"
                      }`}
                    >
                      <span className="truncate">{o.label}</span>
                      {isSelected && (
                        <Check size={14} className="shrink-0 text-[#ff7f11]" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
};

export default SearchableSelect;
