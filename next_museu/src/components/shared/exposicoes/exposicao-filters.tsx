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
    <div
      role="group"
      aria-label="Filtrar exposições"
      className="flex flex-wrap gap-2"
    >
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onFilterChange(filter)}
          aria-pressed={selectedFilter === filter}
          className="min-h-10 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
