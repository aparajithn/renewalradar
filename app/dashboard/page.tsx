'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { Contract } from '@/types/contract';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    checkUser();
    loadContracts();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
  }

  async function loadContracts() {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('renewal_date', { ascending: true });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  function getStatusColor(renewalDate: string) {
    const days = differenceInDays(parseISO(renewalDate), new Date());
    
    if (days < 0) return 'bg-gray-100 text-gray-800';
    if (days <= 7) return 'bg-red-100 text-red-800';
    if (days <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  function getStatusText(renewalDate: string) {
    const days = differenceInDays(parseISO(renewalDate), new Date());
    
    if (days < 0) return 'Expired';
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow';
    return `in ${days} days`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">RenewalRadar</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Contracts</h2>
            <p className="text-gray-600 mt-1">
              {contracts.length} {contracts.length === 1 ? 'contract' : 'contracts'} tracked
            </p>
          </div>
          <Link
            href="/contracts/new"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            + Add Contract
          </Link>
        </div>

        {contracts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No contracts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your first contract to get started
            </p>
            <Link
              href="/contracts/new"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Upload Contract
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {contracts.map((contract) => {
              const daysUntil = differenceInDays(parseISO(contract.renewal_date), new Date());
              
              return (
                <Link
                  key={contract.id}
                  href={`/contracts/${contract.id}`}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {contract.name}
                      </h3>
                      {contract.vendor_name && (
                        <p className="text-sm text-gray-600 mb-2">
                          Vendor: {contract.vendor_name}
                        </p>
                      )}
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          Renewal: {new Date(contract.renewal_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {contract.notice_period_days && (
                          <span>Notice: {contract.notice_period_days} days</span>
                        )}
                        {contract.auto_renews && (
                          <span className="text-orange-600 font-medium">Auto-renews ⚠️</span>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.renewal_date)}`}>
                      {getStatusText(contract.renewal_date)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
