'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ExtractedDates } from '@/types/contract';

export default function NewContractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [contractName, setContractName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedDates | null>(null);
  const [renewalDate, setRenewalDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [autoRenews, setAutoRenews] = useState(false);
  const [contractValue, setContractValue] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createSupabaseClient();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setFile(selectedFile);
    setContractName(selectedFile.name.replace('.pdf', ''));
    setError('');
  }

  async function extractDates() {
    if (!file) return;

    setExtracting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-dates', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract dates');
      }

      const data = await response.json();
      setExtractedData(data);
      
      // Pre-fill form
      if (data.renewal_date) setRenewalDate(data.renewal_date);
      if (data.start_date) setStartDate(data.start_date);
      if (data.notice_period_days) setNoticePeriod(data.notice_period_days.toString());
      if (data.auto_renews !== undefined) setAutoRenews(data.auto_renews);
      if (data.contract_value) setContractValue(data.contract_value.toString());
    } catch (err: any) {
      setError(err.message || 'Failed to extract contract dates');
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!file || !renewalDate) {
      setError('Please upload a file and provide a renewal date');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('contracts')
        .getPublicUrl(fileName);

      // Save contract to database
      const { error: dbError } = await supabase
        .from('contracts')
        .insert({
          user_id: user.id,
          name: contractName,
          vendor_name: vendorName || null,
          file_url: publicUrl,
          start_date: startDate || null,
          renewal_date: renewalDate,
          notice_period_days: noticePeriod ? parseInt(noticePeriod) : null,
          auto_renews: autoRenews,
          contract_value: contractValue ? parseFloat(contractValue) : null,
          notes: notes || null,
        });

      if (dbError) throw dbError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to upload contract');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">RenewalRadar</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Add New Contract</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Contract (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {file && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={extractDates}
                  disabled={extracting}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {extracting ? '🤖 Extracting dates...' : '🤖 AI: Extract Dates'}
                </button>
              </div>
            )}
          </div>

          {/* Contract Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contract Name *
            </label>
            <input
              type="text"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Office Lease Agreement"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor Name
            </label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renewal Date *
              </label>
              <input
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notice Period (days)
              </label>
              <input
                type="number"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="30, 60, 90..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Value ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="1000.00"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-renews"
              checked={autoRenews}
              onChange={(e) => setAutoRenews(e.target.checked)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="auto-renews" className="ml-2 text-sm text-gray-700">
              Contract auto-renews
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {uploading ? 'Saving...' : 'Save Contract'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
