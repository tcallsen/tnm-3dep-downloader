import fs from 'fs';
import { getProducts, filterProducts, sortProducts, Product, generateDownloadList } from '../src/api';

describe('The National Map interation', () => {

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

  // TODO: deprecate/remove?
  it('filterProducts with defaultResolutionStrategy', async () => {
    const boundingBox = 'POLYGON((-122.674011196934 38.0220728663461,-122.52459715119774 38.0220728663461,-122.52459715119774 37.93374140015236,-122.674011196934 37.93374140015236, -122.674011196934 38.0220728663461))';
    const products = await getProducts(boundingBox);
    expect(products.length).toBeGreaterThan(2);

    // filter with default resolution strategy, which will return product with the largest sizeInBytes
    const productsMaxSizeInBytes = Math.max(...products.map(o => o.sizeInBytes), 0);
    const filteredProduct = filterProducts(products);
    expect(filteredProduct.sizeInBytes).toBe(productsMaxSizeInBytes);
  });

  // TODO: deprecate/remove?
  it('filterProducts with custom defaultResolutionStrategy', async () => {
    const products: Product[] = JSON.parse(fs.readFileSync('./test/resources/json/products-two-results.json', 'utf8'));

    // filter with custom resolution strategy, which will return product with the sourceName 'ScienceBaseB'
    const filteredProduct = filterProducts(products, (products: Product[]): Product => {
      return products.filter((product: Product) => product.sourceName === 'ScienceBaseB')[0];
    });
    expect(filteredProduct.sourceName).toBe('ScienceBaseB');
  });

  it('sortProducts - filesize descending, default SortingStrategy', async () => {
    // mock api response
    const response = JSON.parse(fs.readFileSync('./test/resources/json/products-1m-four-tiger-mountain.json', 'utf8'));
    const products = response.items;
    // const boundingBox = 'POLYGON((-121.95974647998105 47.49559703288901,-121.9131524860789 47.49559703288901,-121.9131524860789 47.46768133423269,-121.95974647998105 47.46768133423269, -121.95974647998105 47.49559703288901))';
    // const products = await getProducts(boundingBox);

    const sortedProducts = sortProducts(products);
    expect(sortedProducts.length).toBe(4);
    expect(sortedProducts[0].sizeInBytes).toBeGreaterThan(sortedProducts[1].sizeInBytes);
    expect(sortedProducts[1].sizeInBytes).toBeGreaterThan(sortedProducts[2].sizeInBytes);
    expect(sortedProducts[2].sizeInBytes).toBeGreaterThan(sortedProducts[3].sizeInBytes);
  });

  it('generateDownloadList - base case', async () => {
    // mock gpx feature bounding box and coordinates
    const boundingBox = 'POLYGON((-121.945195 47.491695, -121.920449 47.491695, -121.920449 47.466386, -121.945195 47.466386, -121.945195 47.491695))';
    const coordinates = JSON.parse(fs.readFileSync('./test/resources/json/gpx-feature-coordinates-tiger-mountain.json', 'utf8'));

    const products = await getProducts(boundingBox);
    const sortedProducts = sortProducts(products);

    const downloadList = generateDownloadList(coordinates, sortedProducts);
    expect(downloadList.length).toBe(3);
  });

});