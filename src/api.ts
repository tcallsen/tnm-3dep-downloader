import fetch from 'node-fetch';

const TNM_API_BASE_URL = 'https://tnmaccess.nationalmap.gov';

export async function getProducts(boundingBox: string) {
  const searchUrl = new URL('/api/v1/products', TNM_API_BASE_URL);
  searchUrl.searchParams.append('prodFormats', 'GeoTIFF&datasets=Digital Elevation Model (DEM) 1 meter,National Elevation Dataset (NED) 1/3 arc-second,National Elevation Dataset (NED) 1/9 arc-second');
  searchUrl.searchParams.append('polygon', boundingBox);
  searchUrl.searchParams.append('outputFormat', 'JSON');

  return fetch(searchUrl);
}