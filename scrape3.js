import bcfetch from 'bandcamp-fetch';
import { writeFile } from 'fs/promises'; // Importing the promise-based version of writeFile

async function fetchAlbums() {
  try {
    const discoveryOptions = await bcfetch.discovery.getAvailableOptions();
    // Use discoveryOptions to decide your params

    let allResults = [];
    let page = 6;
    let totalPages =10; // Assume there's at least one page

    while (page <= totalPages) {
      const params = {
        genre: 'ambient',
        location: '4930956',
        page: page // Assuming the API uses 'page' parameter for pagination
        // other parameters as needed
      };

      const results = await bcfetch.discovery.discover(params);
      allResults.push(...results.items); // Adjust based on the actual structure of 'results'

      totalPages = results.totalPages; // Adjust based on actual response
      page++;
    }

    // Writing results to a file
    await writeFile('output.json', JSON.stringify(allResults, null, 2));
    console.log('Results written to output.json');
  } catch (error) {
    console.error('Error fetching albums:', error);
  }
}

fetchAlbums();