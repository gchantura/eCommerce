import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Product, Category } from '../types';
import ImageUpload from './ImageUpload';
import { deleteImage } from '../utils/cloudinary';
import ProductTable from './admin/ProductTable';

interface AdminDashboardProps {
  onAddProduct: (product: any) => void;
  onDeleteProduct: (id: number) => void;
  onEditProduct?: (product: Product) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: number) => void;
  products: Product[];
  categories: Category[];
}

export default function AdminDashboard({ 
  onAddProduct, 
  onDeleteProduct,
  onEditProduct,
  onAddCategory,
  onDeleteCategory,
  products,
  categories 
}: AdminDashboardProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');
  const [onSale, setOnSale] = useState(false);
  const [originalPrice, setOriginalPrice] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryImage, setCategoryImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAddingNewCategory) {
      // Add new category
      const newCategoryData: Category = {
        id: Date.now(),
        name: newCategory,
        image: categoryImage || 'https://via.placeholder.com/400x300'
      };
      onAddCategory(newCategoryData);
    }

    const finalCategory = isAddingNewCategory ? newCategory : category;

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      category: finalCategory,
      description,
      image: imageUrl,
      stock: Number(stock),
      onSale,
      originalPrice: onSale ? Number(originalPrice) : undefined,
      rating: 0,
      reviews: []
    };

    onAddProduct(newProduct);

    // Reset form
    setName('');
    setPrice('');
    setCategory('');
    setNewCategory('');
    setDescription('');
    setImageUrl('');
    setStock('');
    setOnSale(false);
    setOriginalPrice('');
    setIsAddingNewCategory(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setDescription(product.description);
    setImageUrl(product.image);
    setStock(product.stock.toString());
    setOnSale(product.onSale);
    setOriginalPrice(product.originalPrice?.toString() || '');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !onEditProduct) return;

    const updatedProduct = {
      ...editingProduct,
      name,
      price: Number(price),
      category: isAddingNewCategory ? newCategory : category,
      description,
      image: imageUrl,
      stock: Number(stock),
      onSale,
      originalPrice: onSale ? Number(originalPrice) : undefined,
    };

    onEditProduct(updatedProduct);
    setEditingProduct(null);
    
    // Reset form
    setName('');
    setPrice('');
    setCategory('');
    setNewCategory('');
    setDescription('');
    setImageUrl('');
    setStock('');
    setOnSale(false);
    setOriginalPrice('');
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      // First try to delete the image
      if (product.image) {
        await deleteImage(product.image);
      }
      // Then delete the product from your state/database
      onDeleteProduct(product.id);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle error appropriately
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      // First try to delete the image
      if (category.image) {
        await deleteImage(category.image);
      }
      // Then delete the category from your state/databasex 
      onDeleteCategory(category.id);
    } catch (error) {
      console.error('Error deleting category:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Product Management Table */}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
      />

      {/* Product Form */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={editingProduct ? handleUpdate : handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              {isAddingNewCategory ? (
                <div className="mt-1 flex space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    placeholder="Enter new category name"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(false)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex space-x-2">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(true)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    New
                  </button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
                min="0"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <ImageUpload
                onImageSelect={(url) => setImageUrl(url)}
                currentImage={imageUrl}
              />
            </div>

            {isAddingNewCategory && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <ImageUpload
                  onImageSelect={(url) => setCategoryImage(url)}
                  currentImage={categoryImage}
                />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="onSale"
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="onSale" className="ml-2 text-sm text-gray-700">
                  On Sale
                </label>
              </div>

              {onSale && (
                <div className="flex-1">
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                    Original Price
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    required={onSale}
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              required
            />
          </div>

          <div className="flex justify-end">
            {editingProduct && (
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Categories Management Table */}
      <div className="mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Category Management</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={category.image} alt={category.name} className="h-10 w-10 object-cover rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}