import { loadGeoTiffData, convertCoordToPixel } from '../../src/geotiff';
import { loadGpxData } from '../../src/gpx';
import { calculateElevation, writeToCsv } from '../../src/lib/utils';

it('Calculate elevation from GPX file using tiff elevation data', async () => {
  // fremont - mission peak
  // polygon=-121.91554117132182%2037.54125059607636,-121.87132119433234%2037.54125059607636,-121.87132119433234%2037.505526030015204,-121.91554117132182%2037.505526030015204,%20-121.91554117132182%2037.54125059607636&
  // const { image, projection } = await loadGeoTiff('/root/taylor/Documents/dev/tnm-3dep-downloader/data/fremont/USGS_1M_10_x59y416_CA_AlamedaCounty_2021_B21_uncompressed.tif');
  // const gpxFeature = readGpxData('/root/taylor/Documents/dev/tnm-3dep-downloader/data/fremont/Mission_Peak_Climb.gpx');

  const { image, projection } = await loadGeoTiffData('./test/resources/tiff/USGS_1M_10_x58y527_WA_KingCounty_2021_B21.tif');
  const gpxFeature = loadGpxData('./test/resources/gpx/Raging_River_mtb_july_2023.gpx');

  // iterate over gpx data and collect elecations into arrays
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

  writeToCsv('./test/out/gpxElevation.csv', gpxElevation);
  writeToCsv('./test/out/tiffElevation.csv', tiffElevation);

  console.log(`gpx:  ${gpxElevationTotal}`);
  console.log(`tiff: ${tiffElevationTotal}`);
});