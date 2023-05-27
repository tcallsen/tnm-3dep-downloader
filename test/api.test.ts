const { getProducts } = require('../src/api');

describe("TNM API", () => {
  it("should return 17 products", async () => {
    const boundingBox = '-122.674011196934%2038.0220728663461,-122.52459715119774%2038.0220728663461,-122.52459715119774%2037.93374140015236,-122.674011196934%2037.93374140015236,%20-122.674011196934%2038.0220728663461';
    const response = await getProducts(boundingBox);
    expect(response).toBeDefined();
  });
});