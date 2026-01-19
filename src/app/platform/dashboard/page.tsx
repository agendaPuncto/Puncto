'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';

interface PlatformStats {
  totalBusinesses: number;
  activeBusinesses: number;
  totalUsers: number;
  recentSignups: number;
  tierDistribution: Record<string, number>;
  industryDistribution: Record<string, number>;
}

export default function PlatformDashboardPage() {
  const { firebaseUser } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseUser) {
      fetchStats();
    }
  }, [firebaseUser]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = await firebaseUser?.getIdToken();
      const response = await fetch('/api/platform/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Platform Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Businesses
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats?.totalBusinesses || 0}
                  </dd>
                  <dd className="text-xs text-gray-500 mt-1">
                    {stats?.activeBusinesses || 0} active
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats?.totalUsers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recent Signups
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats?.recentSignups || 0}
                  </dd>
                  <dd className="text-xs text-gray-500 mt-1">Last 30 days</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Enterprise
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats?.tierDistribution?.enterprise || 0}
                  </dd>
                  <dd className="text-xs text-gray-500 mt-1">Pro: {stats?.tierDistribution?.pro || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tier Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Subscription Tiers
          </h2>
          <div className="space-y-3">
            {stats?.tierDistribution && Object.entries(stats.tierDistribution).map(([tier, count]) => (
              <div key={tier} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{tier}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        tier === 'enterprise' ? 'bg-purple-600' :
                        tier === 'pro' ? 'bg-blue-600' :
                        tier === 'basic' ? 'bg-green-600' :
                        'bg-gray-600'
                      }`}
                      style={{
                        width: `${stats.totalBusinesses > 0 ? (count / stats.totalBusinesses) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Industries
          </h2>
          <div className="space-y-3">
            {stats?.industryDistribution && Object.entries(stats.industryDistribution).map(([industry, count]) => (
              <div key={industry} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{industry}</span>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/platform/businesses"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
          >
            View All Businesses
          </Link>
          <Link
            href="/platform/users"
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center"
          >
            View All Users
          </Link>
          <Link
            href="/platform/billing"
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center"
          >
            Billing Overview
          </Link>
        </div>
      </div>
    </div>
  );
}

