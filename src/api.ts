import fetch from 'node-fetch';
import fs from 'fs';
import { fromFile, fromArrayBuffer, fromBlob } from 'geotiff';
import proj4 from 'proj4';
import * as geokeysToProj4 from 'geotiff-geokeys-to-proj4';
import { DOMParser } from 'xmldom';
import * as toGeoJSON from '@tmcw/togeojson';

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

export async function getProducts(wktPolygon: string): Promise<Product[]> {
  const polygon = convertWktToApiFormat(wktPolygon);

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

function convertWktToApiFormat(wktPolygon: string): string {
  return wktPolygon.replace('POLYGON', '').replace(/\(/g, '').replace(/\)/g, '');
}

const defaultResolutionStrategy: ResolutionStrategy = function(products: Product[]) {
  return products.reduce(function(prev, current) {
    return (prev.sizeInBytes > current.sizeInBytes) ? prev : current;
  });
};

export async function loadGeoTiff(path: string): Promise<any> {
  const tiff = await fromFile(path);
  const image = await tiff.getImage(); // by default, the first image is read.

  const geoKeys = image.getGeoKeys();
  const projObj = geokeysToProj4.toProj4( geoKeys );
  const projection = proj4( 'WGS84', projObj.proj4 );

  return {
    image,
    projection
  };  
}

// https://towardsdatascience.com/geotiff-js-how-to-get-projected-data-for-a-latitude-longitude-coordinate-87ca437b5aa0
export function convertCoordToPixel(image, projection, lon, lat) {
  const { x, y } = projection.forward({
    x: lon,
    y: lat
  });

  const width = image.getWidth();
  const height = image.getHeight();
  const [ originX, originY ] = image.getOrigin();
  const [ xSize, ySize ] = image.getResolution();
  const uWidth = xSize * width;
  const uHeight = ySize * height;

  const percentX = ( x - originX ) / uWidth;
  const percentY = ( y - originY ) / uHeight;

  const pixelX = Math.floor( width * percentX );
  const pixelY = Math.floor( height * percentY );

  return [pixelX, pixelY];
}

export function readGpxData(path: string) {
  const file = fs.readFileSync(path, 'utf8');
  const gpxDoc = new DOMParser().parseFromString(file);
  const gpxGeoJson = toGeoJSON.gpx(gpxDoc);
  return gpxGeoJson.features[0];
}

// https://github.com/tcallsen/geoCalcLineElevation/blob/master/gpxCalcElevationGain.js#LL29C3-L36C23
export function calculateElevation(elevationArray: number[]): number {
  let elevationGain = 0;
  let lastRecordedElevation = 0;
  elevationArray.forEach( (elevation, index) => {
    if (index == elevationArray.length - 1) return; // stop 1 point early since comparison requires 2 points
    const elevationDifference = elevationArray[index+1] - elevationArray[index];
    if (Math.abs(lastRecordedElevation - elevationArray[index+1]) > .25) {
      if (elevationDifference > 0) {
        elevationGain += elevationDifference;
      }
      lastRecordedElevation = elevationArray[index+1];
    }
  });

  return elevationGain;
}

export function writeToCsv(path, elevationArray) {
  const writeStream = fs.createWriteStream(path);
  writeStream.write(elevationArray.join(','));
}