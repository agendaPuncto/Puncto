'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MarketplaceSearchResult } from '@/types/marketplace';
import Link from 'next/link';

export default function MarketplacePage() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'name'>('rating');
  const [activeTab, setActiveTab] = useState<'establishments' | 'professionals'>('establishments');

  const { data: searchResults, isLoading } = useQuery<MarketplaceSearchResult>({
    queryKey: ['marketplace', query, city, state, serviceType, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      if (serviceType) params.append('serviceType', serviceType);
      params.append('sortBy', sortBy);
      params.append('limit', '20');

      const response = await fetch(`/api/marketplace?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to search marketplace');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900">Professional Marketplace</h1>
          <p className="text-neutral-600 mt-2">
            Discover and book services from verified professionals and establishments
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or service..."
              className="border border-neutral-300 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="border border-neutral-300 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="border border-neutral-300 rounded-lg px-3 py-2"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-neutral-300 rounded-lg px-3 py-2"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('establishments')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'establishments' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'}`}
            >
              Establishments ({searchResults?.establishments.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('professionals')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'professionals' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'}`}
            >
              Professionals ({searchResults?.professionals.length || 0})
            </button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'establishments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults?.establishments.map((establishment) => (
                  <Link
                    key={establishment.businessId}
                    href={`?subdomain=${establishment.businessSlug}`}
                    className="rounded-lg border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {establishment.branding?.coverUrl && (
                      <img
                        src={establishment.branding.coverUrl}
                        alt={establishment.businessName}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900">{establishment.businessName}</h3>
                        {establishment.branding?.logoUrl && (
                          <img
                            src={establishment.branding.logoUrl}
                            alt={establishment.businessName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">
                        {establishment.address.city}, {establishment.address.state}
                      </p>
                      {establishment.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{establishment.rating.toFixed(1)}</span>
                          <span className="text-neutral-600 text-sm">({establishment.reviewsCount || 0} reviews)</span>
                        </div>
                      )}
                      <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{establishment.about}</p>
                      <div className="flex flex-wrap gap-1">
                        {establishment.services.slice(0, 3).map((service) => (
                          <span
                            key={service.serviceId}
                            className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded"
                          >
                            {service.serviceName}
                          </span>
                        ))}
                        {establishment.services.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded">
                            +{establishment.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'professionals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults?.professionals.map((professional) => (
                  <Link
                    key={`${professional.businessId}-${professional.professionalId}`}
                    href={`?subdomain=${professional.businessSlug}`}
                    className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {professional.avatarUrl ? (
                        <img
                          src={professional.avatarUrl}
                          alt={professional.professionalName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
                          <span className="text-2xl">{professional.professionalName.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{professional.professionalName}</h3>
                        <p className="text-sm text-neutral-600">{professional.businessName}</p>
                        {professional.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold text-sm">{professional.rating.toFixed(1)}</span>
                            <span className="text-neutral-600 text-xs">({professional.totalReviews || 0})</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{professional.bio}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {professional.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    {professional.services.length > 0 && (
                      <div className="text-sm text-neutral-600">
                        <p className="font-semibold mb-1">Services from:</p>
                        <p className="text-xs">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            Math.min(...professional.services.map((s) => s.price)) / 100
                          )} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            Math.max(...professional.services.map((s) => s.price)) / 100
                          )}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {searchResults && searchResults.total === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-600">No results found. Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
