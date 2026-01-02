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
        <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
        {selectedCategories.size > 0 && (
          <button
            onClick={onClearCategories}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Tout effacer ({selectedCategories.size})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.has(category.id);
          return (
            <button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
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
