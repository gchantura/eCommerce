import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <div className="relative h-64 rounded-lg overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-2xl font-bold text-white">{category.name}</h3>
        </div>
      </div>
    </div>
  );
}