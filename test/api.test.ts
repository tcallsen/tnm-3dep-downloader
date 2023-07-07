import fs from 'fs';
import { getProducts, filterProducts, Product } from '../src/api';

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
});