interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const safeTotal = Math.min(500, Math.max(1, totalPages));
  if (safeTotal <= 1) return null;

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= safeTotal;

  return (
    <nav
      aria-label="Navigasi halaman"
      className="mt-10 flex flex-wrap items-center gap-4"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        className="px-5 py-2.5 rounded-[10px] bg-[var(--tirai)] text-[var(--kertas)] text-[14px] font-semibold whitespace-nowrap shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#493268] transition-colors duration-150"
      >
        Sebelumnya
      </button>

      <span className="text-[14px] text-[var(--kertas-redup)] tabular-nums">
        Halaman {currentPage} dari {safeTotal}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        className="px-5 py-2.5 rounded-[10px] bg-[var(--lampu)] text-[#1E122E] text-[14px] font-semibold whitespace-nowrap shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-150"
      >
        Berikutnya
      </button>
    </nav>
  );
}
