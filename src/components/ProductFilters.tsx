import { FilterState } from '../types';
import { Category } from '../types';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onCategoryChange: (category: string | null) => void;
  categories: Category[];
  selectedCategory: string | null;
}

export default function ProductFilters({ 
  filters, 
  onFilterChange,
  onCategoryChange,
  categories,
  selectedCategory
}: ProductFiltersProps) {
  const handleChange = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        
        {/* Category Filter */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="mb-6">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPrice" className="sr-only">Minimum Price</label>
              <input
                type="number"
                id="minPrice"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="sr-only">Maximum Price</label>
              <input
                type="number"
                id="maxPrice"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
          <select
            value={filters.rating}
            onChange={(e) => handleChange('rating', Number(e.target.value))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4+ Stars</option>
            <option value={3}>3+ Stars</option>
            <option value={2}>2+ Stars</option>
          </select>
        </div>

        {/* Additional Filters */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="onSale"
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => handleChange('onSale', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="onSale" className="ml-2 text-sm text-gray-700">
              On Sale
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="inStock"
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleChange('inStock', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
              In Stock Only
            </label>
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          onFilterChange({
            sortBy: 'featured',
            minPrice: 0,
            maxPrice: 0,
            rating: 0,
            onSale: false,
            inStock: false
          });
          onCategoryChange(null);
        }}
        className="w-full mt-6 bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}