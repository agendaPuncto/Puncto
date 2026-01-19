'use client';

import Link from 'next/link';

export default function PlatformBillingPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Billing management features will be implemented here. This will include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
          <li>View all active subscriptions</li>
          <li>Monitor billing cycles</li>
          <li>Handle payment disputes</li>
          <li>View Stripe customer data</li>
          <li>Manage subscription upgrades/downgrades</li>
          <li>Revenue analytics and reporting</li>
        </ul>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This page is a placeholder. Full billing management will be implemented in a future update.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/platform/businesses"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Businesses (you can manage subscriptions per business there)
        </Link>
      </div>
    </div>
  );
}
