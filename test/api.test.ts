import { getProducts, filterProducts, Product, loadGeoTiff, convertCoordToPixel, readGpxData, calculateElevation, writeToCsv } from '../src/api';

describe('TNM API', () => {
  it('getProducts - should return products', async () => {
    const boundingBox = '-122.674011196934%2038.0220728663461,-122.52459715119774%2038.0220728663461,-122.52459715119774%2037.93374140015236,-122.674011196934%2037.93374140015236,%20-122.674011196934%2038.0220728663461';
    const products = await getProducts(boundingBox);
    expect(products.length).toBeGreaterThan(2);
  });

  it('getProducts - gracefully handles errors', async () => {
    const boundingBox = 'invalidbbox';
    const products = await getProducts(boundingBox);
    expect(products.length).toBe(0);
  });

  it('filterProducts with defaultResolutionStrategy', async () => {
    const boundingBox = '-122.674011196934%2038.0220728663461,-122.52459715119774%2038.0220728663461,-122.52459715119774%2037.93374140015236,-122.674011196934%2037.93374140015236,%20-122.674011196934%2038.0220728663461';
    const products = await getProducts(boundingBox);
    expect(products.length).toBeGreaterThan(2);

    // filter with default resolution strategy, which will return product with the largest sizeInBytes
    const productsMaxSizeInBytes = Math.max(...products.map(o => o.sizeInBytes), 0);
    const filteredProduct = filterProducts(products);
    expect(filteredProduct.sizeInBytes).toBe(productsMaxSizeInBytes);
  });

  it('filterProducts with custom defaultResolutionStrategy', async () => {
    const products: Product[] = [
      {
        'title': 'USGS one meter x52y420 CA NoCal Wildfires B5b QL1 2018',
        'moreInfo': 'This is a tile of the standard one-meter resolution digital elevation model (DEM) produced through the 3D Elevation Program (3DEP) . The elevations in this DEM represent the topographic bare-earth surface. USGS standard one-meter DEMs are produced exclusively from high resolution light detection and ranging (lidar) source data of one-meter or higher resolution. One-meter DEM surfaces are seamless within collection projects, but, not necessarily seamless across projects. The spatial reference used for tiles of the one-meter DEM within the conterminous United States (CONUS) is Universal Transverse Mercator (UTM) in units of meters, and in conformance with the North American Datum of 1983 (NAD83). All bare earth elevation values are in [...]',
        'sourceId': '5e1fdfeae4b0ecf25c63a601',
        'sourceName': 'ScienceBaseA',
        'sourceOriginId': null,
        'sourceOriginName': 'gda',
        'metaUrl': 'https://www.sciencebase.gov/catalog/item/5e1fdfeae4b0ecf25c63a601',
        'vendorMetaUrl': 'http://nationalmap.gov/3DEP/3dep_prodmetadata.html',
        'publicationDate': new Date('2020-01-14'),
        'lastUpdated': new Date('2020-11-16T16:18:26.505-07:00'),
        'dateCreated': new Date('2020-01-15T21:00:42.588-07:00'),
        'sizeInBytes': 162801884,
        'extent': '10000 x 10000 meter',
        'format': 'GeoTIFF',
        'downloadURL': 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/CA_NoCal_Wildfires_B5b_QL1_2018/TIFF/USGS_1m_x52y420_CA_NoCal_Wildfires_B5b_QL1_2018.tif',
        'downloadURLRaster': null,
        'previewGraphicURL': 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/CA_NoCal_Wildfires_B5b_QL1_2018/browse/USGS_1m_x52y420_CA_NoCal_Wildfires_B5b_QL1_2018.jpg',
        'downloadLazURL': null,
        'urls': {
            'TIFF': 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/CA_NoCal_Wildfires_B5b_QL1_2018/TIFF/USGS_1m_x52y420_CA_NoCal_Wildfires_B5b_QL1_2018.tif'
        },
        'datasets': [],
        'boundingBox': {
            'minX': -122.77243349520211,
            'maxX': -122.65889782080309,
            'minY': 37.85691094864278,
            'maxY': 37.9474235828442
        },
        'bestFitIndex': 0.0,
        'body': 'This is a tile of the standard one-meter resolution digital elevation model (DEM) produced through the 3D Elevation Program (3DEP) .  The elevations in this DEM represent the topographic bare-earth surface.  USGS standard one-meter DEMs are produced exclusively from high resolution light detection and ranging (lidar) source data of one-meter or higher resolution.  One-meter DEM surfaces are seamless within collection projects, but, not necessarily seamless across projects.  The spatial reference used for tiles of the one-meter DEM  within the conterminous United States (CONUS) is Universal Transverse Mercator (UTM) in units of meters, and in conformance with the North American Datum of 1983 (NAD83).  All bare earth elevation values are in meters and are referenced to the North American Vertical Datum of 1988 (NAVD88).  Each tile is distributed in the UTM Zone in which it lies.  If a tile crosses two UTM zones, it is delivered in both zones.  The one-meter DEM is the highest resolution standard DEM offered in the 3DEP product suite.  Other 3DEP products are nationally seamless DEMs in resolutions of 1/3, 1, and 2 arc seconds.  These seamless DEMs were referred to as the National Elevation Dataset (NED) from about 2000 through 2015 at which time they became the seamless DEM layers under the 3DEP program and lost the NED branding.  Other 3DEP products include five-meter DEMs in Alaska as well as various source datasets including the lidar point cloud and interferometric synthetic aperture radar (Ifsar) digital surface models and intensity images. All 3DEP products are public domain.',
        'processingUrl': 'processingUrl',
        'modificationInfo': new Date('2020-11-16')
      },
      {
        'title': 'USGS one meter x52y420 CA NoCal Wildfires B5b QL1 2018',
        'moreInfo': 'This is a tile of the standard one-meter resolution digital elevation model (DEM) produced through the 3D Elevation Program (3DEP) . The elevations in this DEM represent the topographic bare-earth surface. USGS standard one-meter DEMs are produced exclusively from high resolution light detection and ranging (lidar) source data of one-meter or higher resolution. One-meter DEM surfaces are seamless within collection projects, but, not necessarily seamless across projects. The spatial reference used for tiles of the one-meter DEM within the conterminous United States (CONUS) is Universal Transverse Mercator (UTM) in units of meters, and in conformance with the North American Datum of 1983 (NAD83). All bare earth elevation values are in [...]',
        'sourceId': '5e1fdfeae4b0ecf25c63a601',
        'sourceName': 'ScienceBaseB',
        'sourceOriginId': null,
        'sourceOriginName': 'gda',
        'metaUrl': 'https://www.sciencebase.gov/catalog/item/5e1fdfeae4b0ecf25c63a601',
        'vendorMetaUrl': 'http://nationalmap.gov/3DEP/3dep_prodmetadata.html',
        'publicationDate': new Date('2020-01-14'),
        'lastUpdated': new Date('2020-11-16T16:18:26.505-07:00'),
        'dateCreated': new Date('2020-01-15T21:00:42.588-07:00'),
        'sizeInBytes': 162801884,
        'extent': '10000 x 10000 meter',
        'format': 'GeoTIFF',
        'downloadURL': 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/CA_NoCal_Wildfires_B5b_QL1_2018/TIFF/USGS_1m_x52y420_CA_NoCal_Wildfires_B5b_QL1_2018.tif',
        'downloadURLRaster': null,
        'previewGraphicURL': 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/CA_NoCal_Wildfires_B5b_QL1_2018/browse/USGS_1m_x52y420_CA_NoCal_Wildfires_B5b_QL1_2018.jpg',
        'downloadLazURL': null,
        'urls': {
            'TIFF': 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/CA_NoCal_Wildfires_B5b_QL1_2018/TIFF/USGS_1m_x52y420_CA_NoCal_Wildfires_B5b_QL1_2018.tif'
        },
        'datasets': [],
        'boundingBox': {
            'minX': -122.77243349520211,
            'maxX': -122.65889782080309,
            'minY': 37.85691094864278,
            'maxY': 37.9474235828442
        },
        'bestFitIndex': 0.0,
        'body': 'This is a tile of the standard one-meter resolution digital elevation model (DEM) produced through the 3D Elevation Program (3DEP) .  The elevations in this DEM represent the topographic bare-earth surface.  USGS standard one-meter DEMs are produced exclusively from high resolution light detection and ranging (lidar) source data of one-meter or higher resolution.  One-meter DEM surfaces are seamless within collection projects, but, not necessarily seamless across projects.  The spatial reference used for tiles of the one-meter DEM  within the conterminous United States (CONUS) is Universal Transverse Mercator (UTM) in units of meters, and in conformance with the North American Datum of 1983 (NAD83).  All bare earth elevation values are in meters and are referenced to the North American Vertical Datum of 1988 (NAVD88).  Each tile is distributed in the UTM Zone in which it lies.  If a tile crosses two UTM zones, it is delivered in both zones.  The one-meter DEM is the highest resolution standard DEM offered in the 3DEP product suite.  Other 3DEP products are nationally seamless DEMs in resolutions of 1/3, 1, and 2 arc seconds.  These seamless DEMs were referred to as the National Elevation Dataset (NED) from about 2000 through 2015 at which time they became the seamless DEM layers under the 3DEP program and lost the NED branding.  Other 3DEP products include five-meter DEMs in Alaska as well as various source datasets including the lidar point cloud and interferometric synthetic aperture radar (Ifsar) digital surface models and intensity images. All 3DEP products are public domain.',
        'processingUrl': 'processingUrl',
        'modificationInfo': new Date('2020-11-16')
      }
    ];

    // filter with custom resolution strategy, which will return product with the sourceName 'ScienceBaseB'
    const filteredProduct = filterProducts(products, (products: Product[]): Product => {
      return products.filter((product: Product) => product.sourceName === 'ScienceBaseB')[0];
    });
    expect(filteredProduct.sourceName).toBe('ScienceBaseB');
  });

  it.only('GPX file elevation diff', async () => {
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