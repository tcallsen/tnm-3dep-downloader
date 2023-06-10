import fetch from 'node-fetch';

const TNM_API_BASE_URL = 'https://tnmaccess.nationalmap.gov';

export interface productsResponse {
  total: number,
  sciencebaseQuery: string,
  filteredOut: number,
  items: any[],
  errors: any[],
  messagess: string[],
}

// TODO: adjust method to accept bounding box instead of polygon
export async function getProducts(polygon: string): Promise<productsResponse> {
  const searchUrl = new URL('/api/v1/products', TNM_API_BASE_URL);
  searchUrl.searchParams.append('prodFormats', 'GeoTIFF');
  searchUrl.searchParams.append('datasets', 'Digital Elevation Model (DEM) 1 meter,National Elevation Dataset (NED) 1/3 arc-second,National Elevation Dataset (NED) 1/9 arc-second');
  searchUrl.searchParams.append('outputFormat', 'JSON');

  // API does not expect polygon param's commas to be URL encoded (which occurs when using searchParams)
  const finalSearchUrl = `${searchUrl.href}&polygon=${polygon}`;

  const response = await fetch(finalSearchUrl);

  if (response.ok) {
    const responseJson = await response.json();
    return responseJson as productsResponse;
  }
  return '[]';
}

// export async function filterProducts(products) {
  
// }