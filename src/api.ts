const fetch = require('node-fetch');

const TNM_API_BASE_URL = 'https://tnmaccess.nationalmap.gov';

// TODO: adjust method to accept bounding box instead of polygon
export async function getProducts(polygon: string) {
  const searchUrl = new URL('/api/v1/products', TNM_API_BASE_URL);
  searchUrl.searchParams.append('prodFormats', 'GeoTIFF');
  searchUrl.searchParams.append('datasets', 'Digital Elevation Model (DEM) 1 meter,National Elevation Dataset (NED) 1/3 arc-second,National Elevation Dataset (NED) 1/9 arc-second');
  searchUrl.searchParams.append('outputFormat', 'JSON');

  // API does not expect polygon param's commas to be URL encoded (which occurs when using searchParams)
  const finalSearchUrl = `${searchUrl.href}&polygon=${polygon}`;

  const response = await fetch(finalSearchUrl);

  if (response.ok) {
    return response.json();
  }
  return '[]'
}