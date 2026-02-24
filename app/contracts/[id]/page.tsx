'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { Contract } from '@/types/contract';
import { useRouter } from 'next/navigation';
import { differenceInDays, parseISO } from 'date-fns';

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    loadContract();
  }, [params.id]);

  async function loadContract() {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setContract(data);
    } catch (error) {
      console.error('Error loading contract:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteContract() {
    if (!confirm('Are you sure you want to delete this contract?')) return;

    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting contract:', error);
      alert('Failed to delete contract');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Contract not found</div>
      </div>
    );
  }

  const daysUntilRenewal = differenceInDays(parseISO(contract.renewal_date), new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">RenewalRadar</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{contract.name}</h2>
              {contract.vendor_name && (
                <p className="text-lg text-gray-600 mt-1">Vendor: {contract.vendor_name}</p>
              )}
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              daysUntilRenewal < 0 
                ? 'bg-gray-100 text-gray-800'
                : daysUntilRenewal <= 7 
                ? 'bg-red-100 text-red-800'
                : daysUntilRenewal <= 30 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {daysUntilRenewal < 0 
                ? 'Expired'
                : daysUntilRenewal === 0 
                ? 'Renews Today!'
                : `${daysUntilRenewal} days until renewal`
              }
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {contract.start_date && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                <p className="text-lg text-gray-900">
                  {new Date(contract.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Renewal Date</label>
              <p className="text-lg text-gray-900">
                {new Date(contract.renewal_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {contract.notice_period_days && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Notice Period</label>
                <p className="text-lg text-gray-900">{contract.notice_period_days} days</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Auto-Renews</label>
              <p className="text-lg text-gray-900">
                {contract.auto_renews ? (
                  <span className="text-orange-600 font-medium">Yes ⚠️</span>
                ) : (
                  'No'
                )}
              </p>
            </div>

            {contract.contract_value && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contract Value</label>
                <p className="text-lg text-gray-900">
                  ${contract.contract_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>

          {contract.notes && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
              <p className="text-gray-900">{contract.notes}</p>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-500 mb-1">Contract File</label>
            <a
              href={contract.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-indigo-600 hover:text-indigo-800 underline"
            >
              View PDF →
            </a>
          </div>

          <div className="border-t pt-6 flex gap-4">
            <button
              onClick={deleteContract}
              className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
            >
              Delete Contract
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
