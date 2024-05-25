import axios from 'axios';
import * as cheerio from "cheerio";
import dataAfterScrapingWebs from './src/utils/scrapWebsite.js';


// Set to store visited URLs
const visitedUrls = new Set();

// Function to scrape URLs from a webpage
async function scrapeUrls(url) {
  try {
    // Fetch webpage HTML
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract URLs from links
    const urls = [];
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        urls.push(href);
      }
    });

    // Add discovered URLs to visited set
    visitedUrls.add(url);

    // Return URLs found on the page
    return urls;
  } catch (error) {
    console.error('Error scraping URLs from:', url, error);
    return [];
  }
}

// Function to recursively scrape URLs
async function scrapeAllUrls(urls) {
  for (const url of urls) {
    // Skip if already visited
    if (visitedUrls.has(url)) {
      continue;
    }

    // Scrape URLs from the current page
    const discoveredUrls = await scrapeUrls(url);

    // Recursively scrape URLs from discovered pages
    await scrapeAllUrls(discoveredUrls);
  }
}

// Example usage
const initialUrls = ['https://propropertylcv.com']; // Add initial URLs here
scrapeAllUrls(initialUrls)
  .then((data) => {
    console.log(data)
    console.log('All URLs scraped successfully');
  })
  .catch(error => {
    console.error('Error scraping URLs:', error);
  });
