import { MediaType } from '../../types';

interface FilterBarProps {
  selectedType: MediaType | 'all';
  onTypeChange: (type: MediaType | 'all') => void;
}

const FilterBar = ({ selectedType, onTypeChange }: FilterBarProps) => {
  const types: Array<{ value: MediaType | 'all'; label: string }> = [
    { value: 'all', label: 'Tous' },
    { value: 'newspaper', label: 'Quotidiens' },
    { value: 'magazine', label: 'Magazines' }
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
          <div className="flex space-x-2">
            {types.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onTypeChange(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
