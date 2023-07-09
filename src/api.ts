import fetch from 'node-fetch';
import { Feature, Polygon, polygon, Point, point } from '@turf/helpers';
import booleanContains from '@turf/boolean-contains';

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

export type SortingStrategy = (products: Product[]) => Product[];

export async function getProducts(wktPolygon: string): Promise<Product[]> {
  const polygon = convertWktToApiFormat(wktPolygon);

  const searchUrl = new URL('/api/v1/products', TNM_API_BASE_URL);
  searchUrl.searchParams.append('prodFormats', 'GeoTIFF');
  // include other products besides 1m
  // searchUrl.searchParams.append('datasets', 'Digital Elevation Model (DEM) 1 meter,National Elevation Dataset (NED) 1/3 arc-second,National Elevation Dataset (NED) 1/9 arc-second');
  searchUrl.searchParams.append('datasets', 'Digital Elevation Model (DEM) 1 meter');
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

function convertWktToApiFormat(wktPolygon: string): string {
  return wktPolygon.replace('POLYGON', '').replace(/\(/g, '').replace(/\)/g, '');
}

export function getWktFromPolygon(polygon: Feature<Polygon>): string {
  if (polygon.bbox) {
    return `POLYGON((${polygon.bbox[0]} ${polygon.bbox[3]}, ${polygon.bbox[2]} ${polygon.bbox[3]}, ${polygon.bbox[2]} ${polygon.bbox[1]}, ${polygon.bbox[0]} ${polygon.bbox[1]}, ${polygon.bbox[0]} ${polygon.bbox[3]}))`;
  }
  return 'POLYGON(())';
}

export function getPolygonFromBoundingBox(boundingBox: ProductBoundingBox): Feature<Polygon> {
  return polygon([[[boundingBox.minX, boundingBox.maxY], [boundingBox.maxX, boundingBox.maxY], [boundingBox.maxX, boundingBox.minY], [boundingBox.minX, boundingBox.minY], [boundingBox.minX, boundingBox.maxY]]]);
}

export function sortProducts(products: Product[], sortingStrategy: SortingStrategy = defaultSortingStrategy): Product[] {
  const productsClone = [ ...products ];
  return sortingStrategy(productsClone);
}

const defaultSortingStrategy: SortingStrategy = function(products: Product[]) {
  return products.sort(function(a, b) {
    return a.sizeInBytes < b.sizeInBytes ? 1 : -1;
  });
};

export function generateDownloadList(gpxCoordinates, products: Product[]): Product[] {

  const productsToDownload = {};

  // loop through coords and find tiff file that contains data for each
  for (const coord of gpxCoordinates) {

    const gpxCoord: Feature<Point> = point([coord[0], coord[1]]);

    // iterate over available products to determine which includes the coord and mark for download
    //  note: products should be are sorted in descending order of preference so most desirable (highest res) are used first
    //  TODO: replace this with some kind of queriable spatial index
    products.some((product: Product) => {
      const productPolygon = getPolygonFromBoundingBox(product.boundingBox);

      if (booleanContains(productPolygon, gpxCoord) && !productsToDownload[product.sourceId]){
        productsToDownload[product.sourceId] = product;
        return true;
      }
    });
  }

  return Object.values(productsToDownload);
}