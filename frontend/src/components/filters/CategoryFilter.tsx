interface CategoryFilterProps {
  selectedCategories: Set<string>;
  onToggleCategory: (category: string) => void;
  onClearCategories: () => void;
}

// Only 3 categories
const categories = [
  { id: 'main', label: 'Général' },
  { id: 'economy', label: 'Économie' },
  { id: 'sports', label: 'Sports' }
] as const;

const CategoryFilter = ({
  selectedCategories,
  onToggleCategory,
  onClearCategories
}: CategoryFilterProps) => {

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Catégories</h2>
        {selectedCategories.size > 0 && (
          <button
            onClick={onClearCategories}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 underline underline-offset-2 transition-colors"
          >
            Tout effacer ({selectedCategories.size})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 lg:gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategories.has(category.id);
          return (
            <button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-gray-800 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:text-gray-900 hover:shadow-md'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
