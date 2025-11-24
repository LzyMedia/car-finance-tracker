'use client';

import { useState } from 'react';
import { Search, ExternalLink, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import Navigation from '@/components/Navigation';
import { Deal } from '@/types';

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setDeals([]);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const data = await response.json();
      setDeals(data.deals || []);

      if (data.deals.length === 0) {
        setError('No deals found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to fetch deals. Please try again later.');
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Deal Finder</h1>
            <p className="text-muted">
              Find the best prices on car parts, mods, and accessories across the web
            </p>
          </div>

          {/* Search Section */}
          <Card gradient>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search for parts, mods, or accessories (e.g., 'turbo kit', 'coilovers', 'exhaust')"
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

              <div className="flex gap-2">
                <span className="text-sm text-muted">Popular searches:</span>
                {['Turbo Kit', 'Coilovers', 'Exhaust', 'Cold Air Intake', 'Wheels'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
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
              <p className="text-muted">Searching for the best deals...</p>
            </div>
          )}

          {/* Demo Notice */}
          {!loading && deals.length === 0 && !error && (
            <Card className="text-center py-12">
              <Search className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Find Your Next Upgrade</h3>
              <p className="text-muted mb-6 max-w-2xl mx-auto">
                Search for car parts, mods, and accessories. Our deal finder will scan multiple
                retailers to find you the best prices available.
              </p>
              <div className="bg-surface-elevated rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-jdm-cyan mb-2">💡 Note</p>
                <p className="text-sm text-muted">
                  This is a demo application. The web scraping feature requires server-side implementation
                  and proper API keys. Currently showing sample data for demonstration purposes.
                </p>
              </div>
            </Card>
          )}

          {/* Deals Grid */}
          {deals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Found {deals.length} deals for "{searchQuery}"
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
        {/* Product Image */}
        {deal.imageUrl && (
          <div className="w-full h-48 bg-surface rounded-lg mb-4 overflow-hidden">
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
            {deal.title}
          </h3>

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
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                ${deal.price.toFixed(2)}
              </span>
              {deal.originalPrice && deal.originalPrice > deal.price && (
                <span className="text-lg text-muted line-through">
                  ${deal.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-sm text-jdm-cyan font-semibold">
                Save {discount.toFixed(0)}%
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
