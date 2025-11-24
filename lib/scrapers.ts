// Web scraping utilities for car listings and parts
import { Deal } from '@/types';
import { generateId } from './storage';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrape visor.vin for car listings
 */
export async function scrapeVisorVin(carSearchTerms: string[]): Promise<Deal[]> {
  try {
    const deals: Deal[] = [];
    const searchTerm = carSearchTerms[0].replace(/\s+/g, '+');
    const url = `https://visor.vin/search?q=${encodeURIComponent(searchTerm)}`;

    // Fetch the page with browser-like headers to avoid being blocked
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Parse visor.vin listings
    // Visor.vin uses card-based layout for listings
    $('a[href*="/listing/"]').each((i, element) => {
      const $card = $(element);
      const listingUrl = 'https://visor.vin' + $card.attr('href');

      // Extract title
      const title = $card.find('h3, h4, .title, [class*="title"]').first().text().trim() ||
                    $card.find('div').first().text().trim();

      // Extract price - look for dollar signs
      const priceText = $card.text().match(/\$[\d,]+/)?.[0] || '';
      const price = priceText ? parseInt(priceText.replace(/[$,]/g, '')) : 0;

      // Extract mileage if available
      const mileageMatch = $card.text().match(/([\d,]+)\s*(?:miles|mi)/i);
      const mileage = mileageMatch ? mileageMatch[1] : '';

      // Only add if we have valid data
      if (title && listingUrl && price > 0) {
        deals.push({
          id: generateId(),
          title: title,
          price: price,
          url: listingUrl,
          source: 'Visor.vin',
          inStock: true,
          lastUpdated: new Date().toISOString(),
          description: mileage ? `${mileage} miles` : undefined,
        });
      }
    });

    // If no results found via scraping, fallback to generating direct search links
    if (deals.length === 0) {
      console.log('No listings parsed from visor.vin, generating search link');
      deals.push({
        id: generateId(),
        title: `View ${carSearchTerms[0]} listings on Visor.vin`,
        price: 0,
        url: url,
        source: 'Visor.vin',
        inStock: true,
        lastUpdated: new Date().toISOString(),
        description: 'Click to search on Visor.vin',
      });
    }

    return deals.sort((a, b) => a.price - b.price).slice(0, 20);
  } catch (error) {
    console.error('Error scraping visor.vin:', error);

    // Fallback: return a direct search link
    const searchTerm = carSearchTerms[0].replace(/\s+/g, '+');
    const url = `https://visor.vin/search?q=${encodeURIComponent(searchTerm)}`;

    return [{
      id: generateId(),
      title: `Search ${carSearchTerms[0]} on Visor.vin`,
      price: 0,
      url: url,
      source: 'Visor.vin',
      inStock: true,
      lastUpdated: new Date().toISOString(),
      description: 'Click to view search results',
    }];
  }
}

/**
 * Scrape parts retailers for specific parts
 */
export async function scrapePartsRetailers(
  searchTerms: string[],
  carContext?: string
): Promise<Deal[]> {
  try {
    const deals: Deal[] = [];
    const query = carContext
      ? `${carContext} ${searchTerms.join(' ')}`
      : searchTerms.join(' ');

    // Retailers with their actual search URLs
    const retailers = [
      {
        name: 'Summit Racing',
        searchUrl: `https://www.summitracing.com/search?keyword=${encodeURIComponent(query)}`,
        baseUrl: 'https://www.summitracing.com',
      },
      {
        name: 'RockAuto',
        searchUrl: `https://www.rockauto.com/en/catalog/${encodeURIComponent(query)}`,
        baseUrl: 'https://www.rockauto.com',
      },
      {
        name: 'CARiD',
        searchUrl: `https://www.carid.com/search/${encodeURIComponent(query)}/`,
        baseUrl: 'https://www.carid.com',
      },
      {
        name: 'Vivid Racing',
        searchUrl: `https://www.vividracing.com/search.php?search_query=${encodeURIComponent(query)}`,
        baseUrl: 'https://www.vividracing.com',
      },
      {
        name: 'ModBargains',
        searchUrl: `https://www.modbargains.com/search?q=${encodeURIComponent(query)}`,
        baseUrl: 'https://www.modbargains.com',
      },
      {
        name: 'FCP Euro',
        searchUrl: `https://www.fcpeuro.com/search?search_query=${encodeURIComponent(query)}`,
        baseUrl: 'https://www.fcpeuro.com',
      },
    ];

    // Try to scrape each retailer with a timeout
    const scrapePromises = retailers.map(async (retailer) => {
      try {
        const response = await axios.get(retailer.searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          timeout: 5000,
          maxRedirects: 5,
        });

        const $ = cheerio.load(response.data);
        const foundDeals: Deal[] = [];

        // Generic selectors that work across most e-commerce sites
        const productSelectors = [
          '.product-item, .product-card, .product, [class*="product"]',
          '.item, [class*="item-"]',
          'article',
        ];

        for (const selector of productSelectors) {
          $(selector).slice(0, 5).each((i, element) => {
            const $item = $(element);

            // Try to find product title
            const title = $item.find('h2, h3, h4, .title, [class*="title"], [class*="name"]').first().text().trim() ||
                          $item.find('a').first().attr('title') ||
                          '';

            // Try to find price
            const priceText = $item.find('[class*="price"], .price, [itemprop="price"]').first().text();
            const priceMatch = priceText?.match(/\$?([\d,]+\.?\d*)/);
            const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

            // Try to find product link
            const productLink = $item.find('a').first().attr('href') || '';
            const fullUrl = productLink.startsWith('http')
              ? productLink
              : productLink.startsWith('/')
                ? retailer.baseUrl + productLink
                : '';

            if (title && price > 0 && fullUrl) {
              foundDeals.push({
                id: generateId(),
                title: title,
                price: Math.round(price),
                url: fullUrl,
                source: retailer.name,
                inStock: true,
                lastUpdated: new Date().toISOString(),
              });
            }
          });

          if (foundDeals.length > 0) break;
        }

        // If scraping didn't work, add a search link
        if (foundDeals.length === 0) {
          foundDeals.push({
            id: generateId(),
            title: `Search "${query}" on ${retailer.name}`,
            price: 0,
            url: retailer.searchUrl,
            source: retailer.name,
            inStock: true,
            lastUpdated: new Date().toISOString(),
            description: 'Click to view search results',
          });
        }

        return foundDeals;
      } catch (error) {
        // Return search link as fallback
        return [{
          id: generateId(),
          title: `Search "${query}" on ${retailer.name}`,
          price: 0,
          url: retailer.searchUrl,
          source: retailer.name,
          inStock: true,
          lastUpdated: new Date().toISOString(),
          description: 'Click to view search results',
        }];
      }
    });

    // Wait for all scraping attempts
    const results = await Promise.all(scrapePromises);
    results.forEach(retailerDeals => {
      deals.push(...retailerDeals);
    });

    // Sort by price (but put $0 search links at the end)
    return deals.sort((a, b) => {
      if (a.price === 0 && b.price === 0) return 0;
      if (a.price === 0) return 1;
      if (b.price === 0) return -1;
      return a.price - b.price;
    });
  } catch (error) {
    console.error('Error scraping parts retailers:', error);
    return [];
  }
}

/**
 * Get realistic base prices for different part types
 */
function getBasePriceForPartType(partType: string): number {
  const priceMap: { [key: string]: number } = {
    // Engine
    'turbo': 2500,
    'supercharger': 4500,
    'cold air intake': 350,
    'intake': 350,
    'intercooler': 800,
    'ecu': 650,
    'tune': 650,
    'injectors': 550,
    'fuel pump': 250,

    // Exhaust
    'exhaust': 1200,
    'cat back': 1200,
    'turbo back': 1800,
    'headers': 650,
    'downpipe': 550,

    // Suspension
    'coilovers': 1400,
    'coilover': 1400,
    'springs': 280,
    'sway bar': 320,
    'strut': 180,

    // Brakes
    'brake kit': 1800,
    'big brake': 2200,
    'brake pads': 180,
    'rotors': 320,

    // Wheels
    'wheels': 1600,
    'rims': 1600,
    'tires': 850,
    'spacers': 120,

    // Exterior
    'body kit': 1200,
    'spoiler': 450,
    'wing': 550,
    'hood': 850,

    // Interior
    'seats': 950,
    'steering wheel': 380,
    'shift knob': 85,

    // Electronics
    'gauges': 180,
    'gauge': 180,
    'blow off valve': 220,
    'bov': 220,
  };

  for (const [key, price] of Object.entries(priceMap)) {
    if (partType.includes(key)) {
      return price;
    }
  }

  return 500; // Default price
}

/**
 * Get realistic brand names for part types
 */
function getBrandNamesForPartType(partType: string): string[] {
  const brandMap: { [key: string]: string[] } = {
    turbo: ['Garrett', 'Precision', 'BorgWarner', 'Turbonetics'],
    supercharger: ['Vortech', 'ProCharger', 'Magnuson', 'Edelbrock'],
    intake: ['AEM', 'K&N', 'Injen', 'AFE'],
    intercooler: ['Mishimoto', 'CSF', 'Garrett', 'PWR'],
    exhaust: ['Borla', 'Magnaflow', 'Corsa', 'AWE Tuning'],
    coilover: ['BC Racing', 'KW', 'Tein', 'Ohlins'],
    brake: ['Brembo', 'StopTech', 'Wilwood', 'AP Racing'],
    wheels: ['Enkei', 'Volk Racing', 'BBS', 'Rays'],
    seats: ['Recaro', 'Sparco', 'Bride', 'Corbeau'],
  };

  for (const [key, brands] of Object.entries(brandMap)) {
    if (partType.includes(key)) {
      return brands;
    }
  }

  return ['OEM', 'Performance', 'Pro', 'Sport'];
}

/**
 * Main scraper function that routes to appropriate scraper
 */
export async function scrapeDeals(params: {
  query?: string;
  selectedCar?: string;
  selectedMods?: string[];
}): Promise<Deal[]> {
  const { query, selectedCar, selectedMods } = params;

  // If only car is selected, scrape visor.vin
  if (selectedCar && (!selectedMods || selectedMods.length === 0) && !query) {
    // Get car search terms from car ID
    // This would need the car filter data, which we'll pass in
    return [];
  }

  // If mods are selected (with or without car), scrape parts retailers
  if (selectedMods && selectedMods.length > 0) {
    // Get mod search terms and combine with car context
    return [];
  }

  // If only search query, scrape parts retailers
  if (query) {
    return scrapePartsRetailers([query]);
  }

  return [];
}
