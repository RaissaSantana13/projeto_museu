'use client';

interface ProgramacaoFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProgramacaoFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: ProgramacaoFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={`shrink-0 rounded px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
            selectedCategory === category
              ? 'bg-[#9f4d0c] text-white'
              : 'bg-[#c58225] text-white hover:bg-[#9f4d0c]'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
