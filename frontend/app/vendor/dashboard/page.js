'use client';

import { useState, useEffect } from 'react';
import { vendorAPI, productAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function VendorPortalPage() {
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_available: '',
    category_id: '',
    images: [],
    is_free: false,
  });
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user?.is_vendor) {
      fetchVendorProducts();
    } else {
      router.push('/become-vendor');
    }
  }, [user?.is_vendor, isAuthenticated]);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const { data } = await vendorAPI.getMyProducts();
      setProducts(data.products);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData((prev) => ({
      ...prev,
      images: Array.from(files || []),
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('quantity_available', formData.quantity_available);
      submitData.append('category_id', formData.category_id);
      submitData.append('is_free', formData.is_free);

      formData.images.forEach((img) => {
        submitData.append('images', img);
      });

      await vendorAPI.addProduct(submitData);
      toast.success('Produit ajouté avec succès! En attente de modération.');

      setFormData({
        name: '',
        description: '',
        price: '',
        quantity_available: '',
        category_id: '',
        images: [],
        is_free: false,
      });
      setShowAddProduct(false);
      fetchVendorProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cameroon-light">
      {/* Header */}
      <div className="bg-cameroon-green text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🏪 Mon Magasin</h1>
              <p className="text-cameroon-gold mt-2">{user?.full_name}</p>
            </div>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-cameroon-gold text-cameroon-dark px-6 py-2 rounded-lg font-semibold hover:bg-white transition flex items-center"
            >
              <FiPlus className="mr-2" />
              Ajouter un produit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add Product Form */}
        {showAddProduct && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-cameroon-green mb-6">Ajouter un nouveau produit</h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cameroon-dark font-semibold mb-2">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green"
                    required
                  />
                </div>

                <div>
                  <label className="block text-cameroon-dark font-semibold mb-2">
                    Catégorie
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="1">Agroalimentaire</option>
                    <option value="2">Technologie</option>
                    <option value="3">Habillement</option>
                    <option value="4">Artisanat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-cameroon-dark font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cameroon-dark font-semibold mb-2">
                    Prix (F CFA)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green"
                    disabled={formData.is_free}
                    required={!formData.is_free}
                  />
                </div>

                <div>
                  <label className="block text-cameroon-dark font-semibold mb-2">
                    Quantité disponible
                  </label>
                  <input
                    type="number"
                    name="quantity_available"
                    value={formData.quantity_available}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_free"
                  checked={formData.is_free}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-cameroon-dark font-semibold">
                  Ce produit est gratuit
                </label>
              </div>

              <div>
                <label className="block text-cameroon-dark font-semibold mb-2">
                  Images du produit
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-cameroon-green text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-cameroon-green mb-6">
            Mes produits ({products.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Chargement...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Vous n'avez pas encore de produits</p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-cameroon-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Ajouter un produit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  <h3 className="font-bold text-cameroon-dark mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-cameroon-green">
                      {product.price.toLocaleString('fr-CM')} F
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'pending_approval'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status === 'approved'
                        ? 'Approuvé'
                        : product.status === 'pending_approval'
                        ? 'En attente'
                        : 'Rejeté'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">Stock: {product.quantity_available}</p>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-cameroon-green text-white py-2 rounded text-sm hover:bg-green-700 transition flex items-center justify-center">
                      <FiEdit2 className="mr-1" />
                      Modifier
                    </button>
                    <button className="flex-1 bg-cameroon-red text-white py-2 rounded text-sm hover:bg-red-700 transition flex items-center justify-center">
                      <FiTrash2 className="mr-1" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
