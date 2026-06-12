'use client';

import { useState, useEffect } from 'react';
import { ratingsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FiStar } from 'react-icons/fi';

export default function ProductDetailsPage({ params }) {
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      // This would fetch from API
      setLoading(false);
    } catch (error) {
      console.error('Erreur');
    }
  };

  return (
    <div className="min-h-screen bg-cameroon-light">
      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="text-cameroon-green hover:text-cameroon-dark mb-6"
        >
          ← Retour
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-cameroon-green mb-4">
              Product Name
            </h1>
            <p className="text-gray-600 mb-6">Description du produit</p>

            <div className="mb-6">
              <p className="text-sm text-gray-600">Prix</p>
              <p className="text-3xl font-bold text-cameroon-green">10,000 F CFA</p>
            </div>

            <button className="w-full bg-cameroon-gold text-cameroon-dark py-3 rounded-lg font-bold hover:bg-white transition text-lg">
              🛒 Acheter maintenant
            </button>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Leave Rating */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-cameroon-green mb-4">Donnez votre avis</h3>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`text-2xl ${
                    star <= userRating ? 'text-cameroon-gold' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Votre avis..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green mb-4"
              rows="4"
            />

            <button className="w-full bg-cameroon-green text-white py-2 rounded-lg hover:bg-green-700 transition">
              Publier
            </button>
          </div>

          {/* Ratings List */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-cameroon-green mb-6">Avis des clients</h3>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-cameroon-dark">Jean Dupont</p>
                  <div className="text-cameroon-gold flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Excellent produit, très satisfait!</p>
                <p className="text-gray-400 text-xs mt-2">Il y a 2 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
