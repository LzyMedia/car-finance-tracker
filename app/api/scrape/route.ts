import { NextRequest, NextResponse } from 'next/server';
import { scrapeVisorVin, scrapePartsRetailers } from '@/lib/scrapers';
import { POPULAR_CARS, POPULAR_MODS } from '@/lib/filters';
import { Deal } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { query, carId, modIds } = await request.json();

    // Validate inputs
    if (!query && !carId && (!modIds || modIds.length === 0)) {
      return NextResponse.json(
        { error: 'Please provide a search query or select filters' },
        { status: 400 }
      );
    }

    let deals: Deal[] = [];

    // Case 1: Only car selected -> scrape visor.vin for car listings
    if (carId && (!modIds || modIds.length === 0) && !query) {
      const car = POPULAR_CARS.find(c => c.id === carId);
      if (car) {
        deals = await scrapeVisorVin(car.searchTerms);
      }
    }
    // Case 2: Mods selected (with or without car) -> scrape parts retailers
    else if (modIds && modIds.length > 0) {
      const car = carId ? POPULAR_CARS.find(c => c.id === carId) : null;
      const mods = POPULAR_MODS.filter(m => modIds.includes(m.id));

      // Combine all mod search terms
      const modSearchTerms: string[] = [];
      mods.forEach(mod => {
        modSearchTerms.push(...mod.searchTerms.slice(0, 1)); // Take first search term for each mod
      });

      const carContext = car ? `${car.make} ${car.model}` : undefined;
      deals = await scrapePartsRetailers(modSearchTerms, carContext);
    }
    // Case 3: Search query provided -> scrape parts retailers
    else if (query) {
      const car = carId ? POPULAR_CARS.find(c => c.id === carId) : null;
      const carContext = car ? `${car.make} ${car.model}` : undefined;
      deals = await scrapePartsRetailers([query], carContext);
    }

    return NextResponse.json({
      deals,
      query,
      carId,
      modIds,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in scrape API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}
