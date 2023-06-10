import { getProducts } from '../src/api';

describe('TNM API', () => {
  it.only('getProducts - should return 13 products', async () => {
    const boundingBox = '-122.674011196934%2038.0220728663461,-122.52459715119774%2038.0220728663461,-122.52459715119774%2037.93374140015236,-122.674011196934%2037.93374140015236,%20-122.674011196934%2038.0220728663461';
    const products = await getProducts(boundingBox);
    expect(products.length).toBe(13);
  });

  // it('filterProduct', async () => {
  //   const boundingBox = '-122.674011196934%2038.0220728663461,-122.52459715119774%2038.0220728663461,-122.52459715119774%2037.93374140015236,-122.674011196934%2037.93374140015236,%20-122.674011196934%2038.0220728663461';
  //   const { items: products } = await getProducts(boundingBox);
  //   expect(response.items.length).toBe(13);
  // });
});