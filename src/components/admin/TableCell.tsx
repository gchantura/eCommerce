/**
 * TableCell Component
 * 
 * A reusable component for table cells with consistent styling.
 * Can handle different types of content with appropriate styling.
 * 
 * Features:
 * - Consistent padding and alignment
 * - Optional text wrapping control
 * - Flexible content rendering
 */

interface TableCellProps {
  children: React.ReactNode;
  nowrap?: boolean;         // Whether to prevent text wrapping
  className?: string;       // Additional custom classes
}

export default function TableCell({ 
  children, 
  nowrap = true, 
  className = '' 
}: TableCellProps) {
  return (
    <td className={`
      px-6 py-4 text-sm text-gray-500
      ${nowrap ? 'whitespace-nowrap' : ''}
      ${className}
    `}>
      {children}
    </td>
  );
} 