/**
 * TableHeader Component
 * 
 * Displays the header row of the product management table.
 * Contains column titles with consistent styling.
 * 
 * Features:
 * - Uppercase column titles for better visibility
 * - Consistent spacing and alignment
 * - Light background for visual separation
 */

export default function TableHeader() {
  // Array of column headers for easy maintenance
  const columns = [
    'ID',
    'Image',
    'Name',
    'Description',
    'Category',
    'Stock',
    'Price',
    'Sale Price',
    'Actions'
  ];

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
} 