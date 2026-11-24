import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="bg-[var(--tirai)] border border-[var(--karcis)] rounded-[10px] p-6 max-w-[65ch]"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          size={20}
          aria-hidden="true"
          className="text-[var(--karcis)] shrink-0 mt-0.5"
        />
        <div>
          <p className="text-[16px] text-[var(--kertas)] leading-relaxed">
            {message}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 px-5 py-2.5 rounded-[10px] bg-[var(--lampu)] text-[#1E122E] text-[14px] font-semibold whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity duration-150"
            >
              Coba lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
