import fetch from 'node-fetch';

const TNM_API_BASE_URL = 'https://tnmaccess.nationalmap.gov';

export interface productsResponse {
  total: number,
  sciencebaseQuery: string,
  filteredOut: number,
  items: Product[],
  errors: any[],
  messagess: string[],
}

export interface Product {
  title:             string;
  moreInfo:          string;
  sourceId:          string;
  sourceName:        string;
  sourceOriginId:    null;
  sourceOriginName:  string;
  metaUrl:           string;
  vendorMetaUrl:     string;
  publicationDate:   Date;
  lastUpdated:       Date;
  dateCreated:       Date;
  sizeInBytes:       number;
  extent:            string;
  format:            string;
  downloadURL:       string;
  downloadURLRaster: null;
  previewGraphicURL: string;
  downloadLazURL:    null;
  urls:              ProductUrls;
  datasets:          any[];
  boundingBox:       ProductBoundingBox;
  bestFitIndex:      number;
  body:              string;
  processingUrl:     string;
  modificationInfo:  Date;
}

export interface ProductUrls {
  TIFF: string;
}

export interface ProductBoundingBox {
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
}

export type ResolutionStrategy = (products: Product[]) => Product;

// TODO: adjust method to accept bounding box instead of polygon
export async function getProducts(polygon: string): Promise<Product[]> {
  const searchUrl = new URL('/api/v1/products', TNM_API_BASE_URL);
  searchUrl.searchParams.append('prodFormats', 'GeoTIFF');
  searchUrl.searchParams.append('datasets', 'Digital Elevation Model (DEM) 1 meter,National Elevation Dataset (NED) 1/3 arc-second,National Elevation Dataset (NED) 1/9 arc-second');
  searchUrl.searchParams.append('outputFormat', 'JSON');

  // API does not expect polygon param's commas to be URL encoded (which occurs when using searchParams)
  const finalSearchUrl = `${searchUrl.href}&polygon=${polygon}`;

  const response = await fetch(finalSearchUrl, {});

  if (response.ok) {
    try {
      const responseJson = await response.json();
      if (responseJson.items) {
        return responseJson.items as Product[];
      }
    } catch (ex) {
      console.error(`error retrieving product JSON: ${ex}`);
    }
  }
  return [];
}

export function filterProducts(products: Product[], resolutionStrategy: ResolutionStrategy = defaultResolutionStrategy): Product {
  return resolutionStrategy(products);
}

const defaultResolutionStrategy: ResolutionStrategy = function(products: Product[]) {
  return products.reduce(function(prev, current) {
    return (prev.sizeInBytes > current.sizeInBytes) ? prev : current;
  });
};