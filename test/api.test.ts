import fs from 'fs';
import { getProducts, filterProducts, Product, loadGeoTiff, convertCoordToPixel, readGpxData, calculateElevation, writeToCsv } from '../src/api';

describe('TNM API', () => {
  it('getProducts - should return products', async () => {
    const boundingBox = 'POLYGON((-122.674011196934 38.0220728663461,-122.52459715119774 38.0220728663461,-122.52459715119774 37.93374140015236,-122.674011196934 37.93374140015236, -122.674011196934 38.0220728663461))';
    const products = await getProducts(boundingBox);
    expect(products.length).toBeGreaterThan(2);
  });

  it('getProducts - gracefully handles errors', async () => {
    const boundingBox = 'invalidbbox';
    const products = await getProducts(boundingBox);
    expect(products.length).toBe(0);
  });

  it('filterProducts with defaultResolutionStrategy', async () => {
    const boundingBox = 'POLYGON((-122.674011196934 38.0220728663461,-122.52459715119774 38.0220728663461,-122.52459715119774 37.93374140015236,-122.674011196934 37.93374140015236, -122.674011196934 38.0220728663461))';
    const products = await getProducts(boundingBox);
    expect(products.length).toBeGreaterThan(2);

    // filter with default resolution strategy, which will return product with the largest sizeInBytes
    const productsMaxSizeInBytes = Math.max(...products.map(o => o.sizeInBytes), 0);
    const filteredProduct = filterProducts(products);
    expect(filteredProduct.sizeInBytes).toBe(productsMaxSizeInBytes);
  });

  it('filterProducts with custom defaultResolutionStrategy', async () => {
    const products: Product[] = JSON.parse(fs.readFileSync('./test/resources/products-two-results.json', 'utf8'));

    // filter with custom resolution strategy, which will return product with the sourceName 'ScienceBaseB'
    const filteredProduct = filterProducts(products, (products: Product[]): Product => {
      return products.filter((product: Product) => product.sourceName === 'ScienceBaseB')[0];
    });
    expect(filteredProduct.sourceName).toBe('ScienceBaseB');
  });

  it('GPX file elevation diff', async () => {
    // fremont - mission peak
    // polygon=-121.91554117132182%2037.54125059607636,-121.87132119433234%2037.54125059607636,-121.87132119433234%2037.505526030015204,-121.91554117132182%2037.505526030015204,%20-121.91554117132182%2037.54125059607636&
    // const { image, projection } = await loadGeoTiff('/root/taylor/Documents/dev/tnm-3dep-downloader/data/fremont/USGS_1M_10_x59y416_CA_AlamedaCounty_2021_B21_uncompressed.tif');
    // const gpxFeature = readGpxData('/root/taylor/Documents/dev/tnm-3dep-downloader/data/fremont/Mission_Peak_Climb.gpx');

    const { image, projection } = await loadGeoTiff('/root/taylor/Documents/dev/tnm-3dep-downloader/data/china-camp/USGS_1m_x54y421_CA_NoCal_Wildfires_B5b_QL1_2018_uncompressed.tif');
    const gpxFeature = readGpxData('/root/taylor/Documents/dev/tnm-3dep-downloader/data/china-camp/China_Camp_Loop_with_JS.gpx');

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

    writeToCsv('/root/taylor/Documents/dev/tnm-3dep-downloader/out/gpxElevation.csv', gpxElevation);
    writeToCsv('/root/taylor/Documents/dev/tnm-3dep-downloader/out/tiffElevation.csv', tiffElevation);

    console.log(`gpx:  ${gpxElevationTotal}`);
    console.log(`tiff: ${tiffElevationTotal}`);

  });
});