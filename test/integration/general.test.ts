import { loadGeoTiffData, convertCoordToPixel } from '../../src/geotiff';
import { loadGpxData, getGpxBoundingBox } from '../../src/gpx';
import { calculateElevation } from '../../src/lib/utils';
import { writeImageFile } from '../lib/chart';
import { getProducts, sortProducts, generateDownloadList, getWktFromPolygon } from '../../src/api';

describe('integration tests', () => {

  it.skip('calculate elevation from GPX file using tiff elevation data', async () => {

    // Raging River - east Seattle
    // const { image, projection } = await loadGeoTiffData('./test/resources/tiff/USGS_1M_10_x58y527_WA_KingCounty_2021_B21-UNCOMPRESSED.tif');
    // const gpxFeature = loadGpxData('./test/resources/gpx/Raging_River_mtb_july_2023-gpsvisualizer.com_dem_applied.gpx');

    // Alhambra Valley - east bay
    const { image, projection } = await loadGeoTiffData('./test/resources/tiff/USGS_1m_x57y421_CA_NoCAL_Wildfires_B5b_2018-UNCOMPRESSED.tif');
    const gpxFeature = loadGpxData('./test/resources/gpx/Alhambra_Valley_mtb_june_2023-gpsvisualizer.com_dem_applied.gpx');

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

    await writeImageFile('./test/out/elevationProfile.png', [ gpxElevation, tiffElevation ], ['gpx-dem', 'tiff']);

    console.log(`gpx:  ${gpxElevationTotal}`);
    console.log(`tiff: ${tiffElevationTotal}`);
  });

  it('generate list of files to download from gpx track', async () => {
    const gpxFeature = loadGpxData('./test/resources/gpx/The_Tiger_s_Den_mtb_july_2023-gpsvisualizer.com_dem_applied.gpx');
    const gpxBoundingBox = getGpxBoundingBox(gpxFeature);

    const boundingBox = getWktFromPolygon(gpxBoundingBox);
    const products = await getProducts(boundingBox);
    const sortedProducts = sortProducts(products);

    const downloadList = generateDownloadList(gpxFeature.geometry.coordinates, sortedProducts);
    expect(downloadList.length).toBe(3);
  });

});