'use client';

import { MenuCategory } from '@/types/restaurant';

interface MenuCategoryFilterProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function MenuCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: MenuCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectCategory(null)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-neutral-900 text-white'
            : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-neutral-900 text-white'
              : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
