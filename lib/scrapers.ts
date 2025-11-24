// Web scraping utilities for car listings and parts using headless browser
import { Deal } from '@/types';
import { generateId } from './storage';
import { chromium, Browser, Page } from 'playwright-core';

// Browser instance for reuse
let browserInstance: Browser | null = null;

/**
 * Get or create a browser instance
 */
async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  try {
    // Try to use @sparticuz/chromium for production (Vercel)
    const chromiumPkg = await import('@sparticuz/chromium');
    const executablePath = await chromiumPkg.default.executablePath();

    browserInstance = await chromium.launch({
      args: chromiumPkg.default.args,
      executablePath: executablePath,
      headless: true,
    });
    console.log('Using @sparticuz/chromium for production');
  } catch (error) {
    // Fallback to local chromium for development
    console.log('Using local Chromium for development');
    browserInstance = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  return browserInstance;
}

/**
 * Scrape visor.vin for car listings using headless browser
 */
export async function scrapeVisorVin(carSearchTerms: string[]): Promise<Deal[]> {
  const searchTerm = carSearchTerms[0];
  const url = `https://visor.vin/search?q=${encodeURIComponent(searchTerm)}`;
  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    // Navigate with timeout
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Extract listings data
    const deals = await page.evaluate(() => {
      const results: Array<{title: string; price: number; url: string; mileage?: string}> = [];

      // Find all listing cards (adjust selectors based on actual visor.vin structure)
      const listingSelectors = [
        'a[href*="/listing/"]',
        'a[href*="/vehicle/"]',
        '[data-testid*="listing"]',
        '.listing-card',
        '[class*="listing"]',
      ];

      let foundListings = false;

      for (const selector of listingSelectors) {
        const listings = document.querySelectorAll(selector);

        if (listings.length > 0) {
          foundListings = true;
          listings.forEach((listing, index) => {
            if (index >= 20) return; // Limit to 20 results

            const linkElement = listing.closest('a') || listing.querySelector('a');
            const url = linkElement?.getAttribute('href') || '';
            const fullUrl = url.startsWith('http') ? url : `https://visor.vin${url}`;

            // Extract title
            const titleElement = listing.querySelector('h3, h4, h5, [class*="title"], [class*="name"]');
            const title = titleElement?.textContent?.trim() || '';

            // Extract price
            const text = listing.textContent || '';
            const priceMatch = text.match(/\$\s*([\d,]+)/);
            const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;

            // Extract mileage
            const mileageMatch = text.match(/([\d,]+)\s*(?:mi|miles|km)/i);
            const mileage = mileageMatch ? mileageMatch[1] : undefined;

            if (title && fullUrl) {
              results.push({ title, price, url: fullUrl, mileage });
            }
          });

          if (results.length > 0) break;
        }
      }

      return results;
    });

    await page.close();

    // Convert to Deal format
    const formattedDeals: Deal[] = deals.map(deal => ({
      id: generateId(),
      title: deal.title.substring(0, 200),
      price: deal.price,
      url: deal.url,
      source: 'Visor.vin',
      inStock: true,
      lastUpdated: new Date().toISOString(),
      description: deal.mileage ? `${deal.mileage} miles` : undefined,
    }));

    if (formattedDeals.length > 0) {
      console.log(`Successfully scraped ${formattedDeals.length} listings from visor.vin`);
      return formattedDeals.sort((a, b) => {
        if (a.price === 0 && b.price === 0) return 0;
        if (a.price === 0) return 1;
        if (b.price === 0) return -1;
        return a.price - b.price;
      });
    }

    // Fallback: return search link
    return [{
      id: generateId(),
      title: `${searchTerm} on Visor.vin`,
      price: 0,
      url: url,
      source: 'Visor.vin',
      inStock: true,
      lastUpdated: new Date().toISOString(),
      description: 'Search results from Visor.vin',
    }];
  } catch (error) {
    console.error('Error scraping visor.vin:', error);
    if (page) await page.close().catch(() => {});

    // Fallback: return search link
    return [{
      id: generateId(),
      title: `${searchTerm} on Visor.vin`,
      price: 0,
      url: url,
      source: 'Visor.vin',
      inStock: true,
      lastUpdated: new Date().toISOString(),
      description: 'Search results from Visor.vin',
    }];
  }
}

/**
 * Scrape a single retailer using headless browser
 */
async function scrapeRetailer(
  retailer: { name: string; searchUrl: string; baseUrl: string },
  query: string
): Promise<Deal[]> {
  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    // Navigate to retailer
    await page.goto(retailer.searchUrl, {
      waitUntil: 'networkidle',
      timeout: 10000,
    });

    // Wait for products to load
    await page.waitForTimeout(1500);

    // Extract product data
    const products = await page.evaluate((baseUrl) => {
      const results: Array<{title: string; price: number; url: string}> = [];

      // Generic product selectors for e-commerce sites
      const productSelectors = [
        '.product-item',
        '.product-card',
        '.product',
        '[data-product-id]',
        '[class*="product"]',
        '.item',
        'article',
      ];

      for (const selector of productSelectors) {
        const products = document.querySelectorAll(selector);

        if (products.length > 0) {
          products.forEach((product, index) => {
            if (index >= 5) return; // Limit to 5 per retailer

            // Find title
            const titleEl = product.querySelector('h2, h3, h4, [class*="title"], [class*="name"]');
            const title = titleEl?.textContent?.trim() || '';

            // Find price
            const priceEl = product.querySelector('[class*="price"], .price, [itemprop="price"]');
            const priceText = priceEl?.textContent || '';
            const priceMatch = priceText.match(/\$?([\d,]+\.?\d*)/);
            const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

            // Find link
            const linkEl = product.querySelector('a');
            let url = linkEl?.getAttribute('href') || '';
            if (url && !url.startsWith('http')) {
              url = url.startsWith('/') ? baseUrl + url : baseUrl + '/' + url;
            }

            if (title && price > 0 && url) {
              results.push({ title, price, url });
            }
          });

          if (results.length > 0) break;
        }
      }

      return results;
    }, retailer.baseUrl);

    await page.close();

    // Convert to Deal format
    if (products.length > 0) {
      return products.map(product => ({
        id: generateId(),
        title: product.title,
        price: Math.round(product.price),
        url: product.url,
        source: retailer.name,
        inStock: true,
        lastUpdated: new Date().toISOString(),
      }));
    }

    // Fallback: return search link
    return [{
      id: generateId(),
      title: `Search "${query}" on ${retailer.name}`,
      price: 0,
      url: retailer.searchUrl,
      source: retailer.name,
      inStock: true,
      lastUpdated: new Date().toISOString(),
      description: 'Search results',
    }];
  } catch (error) {
    console.error(`Error scraping ${retailer.name}:`, error);
    if (page) await page.close().catch(() => {});

    // Return search link on error
    return [{
      id: generateId(),
      title: `Search "${query}" on ${retailer.name}`,
      price: 0,
      url: retailer.searchUrl,
      source: retailer.name,
      inStock: true,
      lastUpdated: new Date().toISOString(),
      description: 'Search results',
    }];
  }
}

/**
 * Scrape parts retailers for specific parts using headless browser
 */
export async function scrapePartsRetailers(
  searchTerms: string[],
  carContext?: string
): Promise<Deal[]> {
  const query = carContext
    ? `${carContext} ${searchTerms.join(' ')}`
    : searchTerms.join(' ');

  // Retailers to scrape
  const retailers = [
    {
      name: 'Summit Racing',
      searchUrl: `https://www.summitracing.com/search?keyword=${encodeURIComponent(query)}`,
      baseUrl: 'https://www.summitracing.com',
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
  ];

  try {
    // Scrape retailers in parallel with timeout
    const scrapePromises = retailers.map(retailer =>
      Promise.race([
        scrapeRetailer(retailer, query),
        new Promise<Deal[]>((resolve) =>
          setTimeout(() => resolve([{
            id: generateId(),
            title: `Search "${query}" on ${retailer.name}`,
            price: 0,
            url: retailer.searchUrl,
            source: retailer.name,
            inStock: true,
            lastUpdated: new Date().toISOString(),
            description: 'Search results (timeout)',
          }]), 12000)
        ),
      ])
    );

    const results = await Promise.all(scrapePromises);
    const deals: Deal[] = [];

    results.forEach(retailerDeals => {
      deals.push(...retailerDeals);
    });

    // Sort by price (search links at end)
    return deals.sort((a, b) => {
      if (a.price === 0 && b.price === 0) return 0;
      if (a.price === 0) return 1;
      if (b.price === 0) return -1;
      return a.price - b.price;
    });
  } catch (error) {
    console.error('Error scraping parts retailers:', error);

    // Return search links as fallback
    return retailers.map(retailer => ({
      id: generateId(),
      title: `Search "${query}" on ${retailer.name}`,
      price: 0,
      url: retailer.searchUrl,
      source: retailer.name,
      inStock: true,
      lastUpdated: new Date().toISOString(),
      description: 'Search results',
    }));
  }
}

/**
 * Cleanup function to close browser
 */
export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
