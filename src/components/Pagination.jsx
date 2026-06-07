import { ChevronLeft, ChevronRight } from "lucide-react";

/** Compact prev/next pager. Renders nothing when there's a single page. */
const Pagination = ({ page = 1, pages = 1, total, onPage }) => {
  if (!pages || pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 mt-5">
      {typeof total === "number" ? (
        <span className="text-xs text-neutral-400">{total} total</span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-sm text-neutral-600 disabled:opacity-40 hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors"
        >
          <ChevronLeft size={15} /> Prev
        </button>
        <span className="text-sm text-neutral-500">
          {page} / {pages}
        </span>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-sm text-neutral-600 disabled:opacity-40 hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors"
        >
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
