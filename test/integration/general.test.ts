import { loadGeoTiffData, convertCoordToPixel } from '../../src/geotiff';
import { loadGpxData } from '../../src/gpx';
import { calculateElevation } from '../../src/lib/utils';
import { writeImageFile } from '../lib/chart';

describe.only('Integration tests', () => {

  it('Calculate elevation from GPX file using tiff elevation data', async () => {
    const { image, projection } = await loadGeoTiffData('./test/resources/tiff/USGS_1M_10_x58y527_WA_KingCounty_2021_B21-UNCOMPRESSED.tif');
    const gpxFeature = loadGpxData('./test/resources/gpx/Raging_River_mtb_july_2023.gpx');

    // iterate over gpx data and collect elevations into arrays
    const gpxElevation: number[] = [];
    const tiffElevation: number[] = [];
    for (const coord of gpxFeature.geometry.coordinates) {      
      const [ pixelX, pixelY ] = convertCoordToPixel(image, projection, coord[0], coord[1]);
      const [ elevation ] = await image.readRasters({
        interleave: true,
        window: [ pixelX, pixelY, pixelX + 1, pixelY + 1],
        samples: [ 0 ]
      });
      gpxElevation.push(coord[2]);
      tiffElevation.push(elevation);
    }

    // compute elevation gain in arrays
    const gpxElevationTotal = calculateElevation(gpxElevation);
    const tiffElevationTotal = calculateElevation(tiffElevation);

    await writeImageFile('./test/out/elevationProfile.png', [ gpxElevation, tiffElevation ], ['gpx', 'tiff']);

    console.log(`gpx:  ${gpxElevationTotal}`);
    console.log(`tiff: ${tiffElevationTotal}`);
  });

});