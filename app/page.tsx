import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">RenewalRadar</h1>
        <Link 
          href="/login" 
          className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Stop Losing Thousands to<br />
          Missed Contract Renewals
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Upload your contracts. AI extracts the dates. We remind you before it's too late.
        </p>
        <Link 
          href="/signup" 
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Start Free Trial →
        </Link>
        <p className="text-sm text-gray-600 mt-4">14-day free trial · No credit card required</p>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Are you tracking contracts in a spreadsheet?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">💸</div>
            <h4 className="font-semibold text-gray-900 mb-2">Forgot to cancel that SaaS tool?</h4>
            <p className="text-gray-600 text-sm">Stuck paying $5,000 for another year.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">📉</div>
            <h4 className="font-semibold text-gray-900 mb-2">Missed a client contract renewal?</h4>
            <p className="text-gray-600 text-sm">Lost $20,000 in recurring revenue.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h4 className="font-semibold text-gray-900 mb-2">92% of contract errors are human errors</h4>
            <p className="text-gray-600 text-sm">Excel won't save you.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          RenewalRadar tracks every renewal deadline for you
        </h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl">1️⃣</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload your contract</h4>
              <p className="text-gray-600">PDF, Google Drive, or Dropbox</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl">2️⃣</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">AI extracts renewal dates</h4>
              <p className="text-gray-600">Dates, notice periods, and auto-renewal clauses</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl">3️⃣</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Get reminders before renewal</h4>
              <p className="text-gray-600">30 days, 7 days, and day-of alerts</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl">4️⃣</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Never miss a deadline again</h4>
              <p className="text-gray-600">Email and SMS notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Simple, Fair Pricing</h3>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-5xl font-bold text-indigo-600 mb-2">$29</div>
          <div className="text-gray-600 mb-6">per month</div>
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Unlimited contracts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>AI date extraction</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Email + SMS reminders</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Mobile-friendly dashboard</span>
            </li>
          </ul>
          <Link 
            href="/signup" 
            className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Free Trial
          </Link>
          <p className="text-xs text-gray-500 mt-4">
            Missing one renewal can cost $1,000-$50,000.<br />
            $29/month = peace of mind.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 border-t border-gray-200">
        <p>© 2026 RenewalRadar. Never miss a contract renewal deadline.</p>
      </footer>
    </div>
  );
}
