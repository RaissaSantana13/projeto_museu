'use client';

interface ExposicaoFiltersProps {
  filters: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ExposicaoFilters({
  filters,
  selectedFilter,
  onFilterChange,
}: ExposicaoFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onFilterChange(filter)}
          className={`shrink-0 rounded px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
            selectedFilter === filter
              ? 'bg-[#9f4d0c] text-white'
              : 'bg-[#c58225] text-white hover:bg-[#9f4d0c]'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
