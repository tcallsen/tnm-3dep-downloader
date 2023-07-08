import { fromFile } from 'geotiff';
import proj4 from 'proj4';
import * as geokeysToProj4 from 'geotiff-geokeys-to-proj4';

export async function loadGeoTiffData(path: string): Promise<any> {
  const tiff = await fromFile(path);
  const image = await tiff.getImage(); // by default, the first image is read.

  const geoKeys = image.getGeoKeys();
  const projObj = geokeysToProj4.toProj4( geoKeys );
  const projection = proj4( 'WGS84', projObj.proj4 );

  // TODO: add logic to decompress tiff if compression detected - HUGE performance increase

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