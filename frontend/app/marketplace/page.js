'use client';

import { useState, useEffect } from 'react';
import { productAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiFilter, FiShoppingCart } from 'react-icons/fi';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getProducts({
        category: selectedCategory,
      });
      setProducts(data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await productAPI.getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories');
    }
  };

  return (
    <div className="min-h-screen bg-cameroon-light">
      {/* Header */}
      <div className="bg-cameroon-green text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Marketplace</h1>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-cameroon-dark focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-cameroon-green mb-4 flex items-center">
                <FiFilter className="mr-2" />
                Catégories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    selectedCategory === ''
                      ? 'bg-cameroon-green text-white'
                      : 'text-cameroon-dark hover:bg-gray-100'
                  }`}
                >
                  Tous les produits
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded ${
                      selectedCategory === cat.id
                        ? 'bg-cameroon-green text-white'
                        : 'text-cameroon-dark hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center text-cameroon-dark">Chargement...</div>
            ) : products.length === 0 ? (
              <div className="text-center text-cameroon-dark">Aucun produit trouvé</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-200">
                      {product.images_urls?.[0] && (
                        <Image
                          src={product.images_urls[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      {product.is_free && (
                        <div className="absolute top-2 right-2 bg-cameroon-gold text-cameroon-dark px-3 py-1 rounded-full text-sm font-bold">
                          GRATUIT
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-cameroon-dark mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xl font-bold text-cameroon-green">
                          {product.price.toLocaleString('fr-CM')} F
                        </span>
                        <span className="text-xs bg-cameroon-light px-2 py-1 rounded">
                          {product.quantity_available} en stock
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mb-3">
                        Vendeur: {product.vendor?.full_name}
                      </p>

                      <button
                        onClick={() => router.push(`/marketplace/${product.id}`)}
                        className="w-full bg-cameroon-green text-white py-2 rounded hover:bg-cameroon-dark transition flex items-center justify-center"
                      >
                        <FiShoppingCart className="mr-2" />
                        Détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
