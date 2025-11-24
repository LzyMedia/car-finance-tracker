'use client';

import { useState, useEffect } from 'react';
import { Search, ExternalLink, TrendingDown, AlertCircle, Loader2, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import Navigation from '@/components/Navigation';
import { Deal } from '@/types';
import { POPULAR_CARS, POPULAR_MODS, MOD_CATEGORIES } from '@/lib/filters';

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Engine', 'Exhaust', 'Suspension']);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search when filters change (but not on initial mount)
  useEffect(() => {
    if (hasSearched && (selectedCar || selectedMods.length > 0 || searchQuery)) {
      const timer = setTimeout(() => {
        performSearch();
      }, 300); // Debounce to avoid too many requests

      return () => clearTimeout(timer);
    }
  }, [selectedCar, selectedMods, hasSearched]);

  const performSearch = async () => {
    if (!searchQuery.trim() && !selectedCar && selectedMods.length === 0) {
      setError('Please enter a search term or select filters');
      setDeals([]);
      return;
    }

    setLoading(true);
    setError('');
    setDeals([]);
    setHasSearched(true);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery.trim() || undefined,
          carId: selectedCar,
          modIds: selectedMods.length > 0 ? selectedMods : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const data = await response.json();
      setDeals(data.deals || []);

      if (data.deals.length === 0) {
        setError('No deals found. Try a different search term or filters.');
      }
    } catch (err) {
      setError('Failed to fetch deals. Please try again later.');
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    performSearch();
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleCarSelect = (carId: string) => {
    setSelectedCar(carId);
    if (!hasSearched) {
      setHasSearched(true);
      // Trigger search immediately for first filter selection
      setTimeout(() => performSearch(), 100);
    }
  };

  const toggleMod = (modId: string) => {
    setSelectedMods(prev => {
      const newMods = prev.includes(modId)
        ? prev.filter(id => id !== modId)
        : [...prev, modId];

      if (!hasSearched) {
        setHasSearched(true);
        // Trigger search immediately for first filter selection
        setTimeout(() => performSearch(), 100);
      }

      return newMods;
    });
  };

  const clearFilters = () => {
    setSelectedCar(null);
    setSelectedMods([]);
    setSearchQuery('');
    setDeals([]);
    setError('');
    setHasSearched(false);
  };

  const getActiveFiltersCount = () => {
    return (selectedCar ? 1 : 0) + selectedMods.length;
  };

  const selectedCarData = selectedCar ? POPULAR_CARS.find(c => c.id === selectedCar) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <aside className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0`}>
            <div className="sticky top-4 space-y-4">
              {/* Filter Header */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-jdm-purple" />
                    <h3 className="font-bold text-foreground">Filters</h3>
                    {getActiveFiltersCount() > 0 && (
                      <span className="bg-jdm-purple text-white text-xs px-2 py-0.5 rounded-full">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </div>
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-jdm-cyan hover:text-jdm-pink transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Car Filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase">Select Car</h4>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {POPULAR_CARS.map((car) => (
                      <label
                        key={car.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          selectedCar === car.id
                            ? 'bg-jdm-purple/20 border border-jdm-purple'
                            : 'hover:bg-surface-elevated'
                        }`}
                      >
                        <input
                          type="radio"
                          name="car"
                          checked={selectedCar === car.id}
                          onChange={() => handleCarSelect(car.id)}
                          className="text-jdm-purple"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{car.name}</p>
                          <p className="text-xs text-muted">{car.years}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 my-4" />

                {/* Mods Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase">Select Mods</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {MOD_CATEGORIES.map((category) => (
                      <div key={category}>
                        <button
                          onClick={() => toggleCategory(category)}
                          className="flex items-center justify-between w-full p-2 rounded hover:bg-surface-elevated transition-colors"
                        >
                          <span className="text-sm font-medium text-foreground">{category}</span>
                          {expandedCategories.includes(category) ? (
                            <ChevronUp className="w-4 h-4 text-muted" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted" />
                          )}
                        </button>

                        {expandedCategories.includes(category) && (
                          <div className="ml-2 mt-1 space-y-1">
                            {POPULAR_MODS
                              .filter(mod => mod.category === category)
                              .map((mod) => (
                                <label
                                  key={mod.id}
                                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-surface transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedMods.includes(mod.id)}
                                    onChange={() => toggleMod(mod.id)}
                                    className="text-jdm-purple"
                                  />
                                  <span className="text-sm text-foreground">{mod.name}</span>
                                </label>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Deal Finder</h1>
                <p className="text-muted">
                  {selectedCarData && !selectedMods.length && !searchQuery
                    ? `Find ${selectedCarData.name} listings on visor.vin`
                    : 'Find the best prices on car parts, mods, and accessories'}
                </p>
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCarData && (
                  <div className="flex items-center gap-2 bg-jdm-purple/20 border border-jdm-purple px-3 py-1 rounded-full">
                    <span className="text-sm text-foreground">{selectedCarData.name}</span>
                    <button
                      onClick={() => {
                        setSelectedCar(null);
                        if (selectedMods.length === 0 && !searchQuery) {
                          setDeals([]);
                          setError('');
                        }
                      }}
                      className="text-jdm-purple hover:text-jdm-pink"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedMods.map(modId => {
                  const mod = POPULAR_MODS.find(m => m.id === modId);
                  return mod ? (
                    <div
                      key={modId}
                      className="flex items-center gap-2 bg-jdm-cyan/20 border border-jdm-cyan px-3 py-1 rounded-full"
                    >
                      <span className="text-sm text-foreground">{mod.name}</span>
                      <button
                        onClick={() => toggleMod(modId)}
                        className="text-jdm-cyan hover:text-jdm-pink"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Search Section */}
            <Card gradient>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search for specific parts or accessories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" glow disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm text-muted">Quick search:</span>
                  {['Turbo Kit', 'Coilovers', 'Exhaust', 'Cold Air Intake', 'Wheels'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        setSelectedCar(null);
                        setSelectedMods([]);
                        setHasSearched(true);
                        setTimeout(() => performSearch(), 100);
                      }}
                      className="text-sm text-jdm-cyan hover:text-jdm-pink transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </form>
            </Card>

            {/* Error Message */}
            {error && (
              <Card className="border-jdm-red/50">
                <div className="flex items-center gap-3 text-jdm-red">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </Card>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-jdm-purple mx-auto mb-4 animate-spin" />
                <p className="text-muted">
                  {selectedCarData && !selectedMods.length && !searchQuery
                    ? 'Searching visor.vin for car listings...'
                    : 'Searching for the best deals...'}
                </p>
              </div>
            )}

            {/* No Results */}
            {!loading && deals.length === 0 && !error && (
              <Card className="text-center py-12">
                <Search className="w-16 h-16 text-muted mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Find Your Next Upgrade</h3>
                <p className="text-muted mb-6 max-w-2xl mx-auto">
                  {hasSearched
                    ? 'Try selecting different filters or refining your search'
                    : 'Select filters or search to find deals on car parts and accessories'}
                </p>
              </Card>
            )}

            {/* Deals Grid */}
            {deals.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Found {deals.length} {selectedCarData && !selectedMods.length && !searchQuery ? 'listings' : 'deals'}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <TrendingDown className="w-4 h-4 text-jdm-cyan" />
                    Sorted by best price
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface DealCardProps {
  deal: Deal;
}

function DealCard({ deal }: DealCardProps) {
  const discount = deal.originalPrice
    ? ((deal.originalPrice - deal.price) / deal.originalPrice) * 100
    : 0;

  return (
    <Card hover gradient>
      <div className="flex flex-col h-full">
        {/* Product Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
            {deal.title}
          </h3>

          {deal.description && (
            <p className="text-sm text-muted mb-3">{deal.description}</p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-jdm-cyan font-mono">{deal.source}</span>
            {deal.inStock ? (
              <span className="text-xs bg-jdm-cyan/20 text-jdm-cyan px-2 py-1 rounded">
                In Stock
              </span>
            ) : (
              <span className="text-xs bg-jdm-red/20 text-jdm-red px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            {deal.price > 0 ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    ${deal.price.toLocaleString()}
                  </span>
                  {deal.originalPrice && deal.originalPrice > deal.price && (
                    <span className="text-lg text-muted line-through">
                      ${deal.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <span className="text-sm text-jdm-cyan font-semibold">
                    Save {discount.toFixed(0)}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-semibold text-jdm-purple">
                View Search Results
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full" variant="outline">
            View Deal
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>

        {/* Last Updated */}
        <p className="text-xs text-muted text-center mt-3">
          Updated {new Date(deal.lastUpdated).toLocaleTimeString()}
        </p>
      </div>
    </Card>
  );
}
