import fetch from 'node-fetch';

const TNM_API_BASE_URL = 'https://tnmaccess.nationalmap.gov';

const searchUrl = new URL('/api/v1/products', TNM_API_BASE_URL);
searchUrl.searchParams.append('prodFormats', 'GeoTIFF&datasets=Digital Elevation Model (DEM) 1 meter,National Elevation Dataset (NED) 1/3 arc-second,National Elevation Dataset (NED) 1/9 arc-second');
searchUrl.searchParams.append('polygon', '-122.674011196934%2038.0220728663461,-122.52459715119774%2038.0220728663461,-122.52459715119774%2037.93374140015236,-122.674011196934%2037.93374140015236,%20-122.674011196934%2038.0220728663461');
searchUrl.searchParams.append('outputFormat', 'JSON');

const response = await fetch(searchUrl);

console.log(response);