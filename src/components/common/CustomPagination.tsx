import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: CustomPaginationProps) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
      <div className="flex items-center bg-card rounded-full shadow-lg border border-border p-1.5">
        {/* Previous Button */}
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={cn(
            "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            canGoPrevious
              ? "text-foreground hover:bg-muted"
              : "text-muted-foreground/50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Înapoi</span>
        </button>

        {/* Current Page Indicator */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm mx-2">
          {currentPage}
        </div>

        {/* Next Button */}
        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={cn(
            "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            canGoNext
              ? "text-foreground hover:bg-muted"
              : "text-muted-foreground/50 cursor-not-allowed"
          )}
        >
          <span className="hidden sm:inline">Următorul</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
