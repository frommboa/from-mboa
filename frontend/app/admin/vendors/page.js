'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function VendorApprovalPage() {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
    } else {
      fetchPendingVendors();
    }
  }, [user?.role]);

  const fetchPendingVendors = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getPendingVendors();
      setPendingVendors(data.vendors);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      await adminAPI.validateVendor(vendorId, { action: 'approve' });
      toast.success('Vendeur approuvé');
      fetchPendingVendors();
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleRejectVendor = async (vendorId, reason) => {
    try {
      await adminAPI.validateVendor(vendorId, {
        action: 'reject',
        rejection_reason: reason,
      });
      toast.success('Vendeur rejeté');
      fetchPendingVendors();
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  return (
    <div className="min-h-screen bg-cameroon-light">
      {/* Navbar */}
      <nav className="bg-cameroon-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-white text-2xl font-bold">📋 Approbation KYC Vendeurs</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-center text-gray-600">Chargement...</p>
        ) : pendingVendors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-2xl text-cameroon-green font-bold">✅ Aucun vendeur en attente</p>
            <p className="text-gray-600 mt-2">Tous les KYC ont été traités!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingVendors.map((kyc) => (
              <div key={kyc.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* User Info */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-cameroon-green mb-2">
                      {kyc.User?.full_name}
                    </h3>
                    <p className="text-gray-600">{kyc.User?.email}</p>
                    <p className="text-gray-600">{kyc.User?.phone_number}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      CNI: {kyc.cni_number}
                      {kyc.cni_expiry_date && ` (Expire: ${new Date(kyc.cni_expiry_date).toLocaleDateString('fr-CM')})`}
                    </p>
                  </div>

                  {/* Documents Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Selfie */}
                    <div>
                      <p className="text-sm font-semibold text-cameroon-dark mb-2">Selfie 🤳</p>
                      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={kyc.selfie_url}
                          alt="Selfie"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* CNI */}
                    <div>
                      <p className="text-sm font-semibold text-cameroon-dark mb-2">Carte Nationale d'Identité 🪪</p>
                      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={kyc.cni_url}
                          alt="CNI"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleApproveVendor(kyc.id)}
                      className="flex-1 bg-cameroon-green text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center"
                    >
                      <FiCheckCircle className="mr-2" />
                      Approuver
                    </button>
                    <button
                      onClick={() => handleRejectVendor(kyc.id, 'Documents insuffisants')}
                      className="flex-1 bg-cameroon-red text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center"
                    >
                      <FiXCircle className="mr-2" />
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
