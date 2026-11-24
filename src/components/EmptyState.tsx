interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-[var(--tirai)] rounded-[10px] p-6 md:p-8 max-w-[65ch]">
      <p className="text-[16px] text-[var(--kertas)] leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-5 py-2.5 rounded-[10px] bg-[var(--lampu)] text-[#1E122E] text-[14px] font-semibold whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity duration-150"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
