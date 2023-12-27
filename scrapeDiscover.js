import bcfetch from 'bandcamp-fetch';

async function fetchAlbums() {
  try {
    const discoveryOptions = await bcfetch.discovery.getAvailableOptions();
    // Use discoveryOptions to decide your params
    
    const params = {
      genre: 'ambient',
      location:'6252001'

      // other parameters as needed
    };
    
    const results = await bcfetch.discovery.discover(params);
    console.log(results);
  } catch (error) {
    console.error('Error fetching albums:', error);
  }
}

fetchAlbums();