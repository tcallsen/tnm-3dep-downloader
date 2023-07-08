# The National Map (TNM) 3DEP Product Downloader

The goal of this module is to automatically load USGS GeoTIFF data on demand from [The National Map](https://apps.nationalmap.gov/) for use in local elevation calculations. For example, calculating the elevation gained for a GPX route. This may include:

1. Finding the bouding box of a GPX route (or any WKT shape)
2. Querying TNM API to retrieve avaiable GeoTIFF files for bouding box
3. Downloading the "best" GeoTIFF product for the given area, if multiple are available (defaulting to largest filesize, but customizable via `resolutionStrategy` parameter)
4. Make the GeoTIFF data available to consuming modules (e.g. a module calculating GPX route elevation)

Some stretch goals for #3 may include things like:

- Loading multiple GeoTIFF files from TNM if the bounding box straddles the boundary of 2 or more products (e.g. top of Raging River GPX route [falls into another product](./docs/img/example-raging-river-gpx-straddles-multiple-products.png))
- Ability to load another GeoTIFF product from TNM if selected product does not contain data for lat/long combo

## Proof of Concept

[Additional code](./test/integration/elevation.test.ts) and [testing resources](./test/resources/) have been added to this module temporarily to test GPX route elevation calculation and visualize the output. If successful, this code may be moved to other modules later.

## TNM API Spec

This module is coded to follow the National Map API spec [documented here](https://apps.nationalmap.gov/help/documents/TNMAccessAPIDocumentation/TNMAccessAPIDocumentation.pdf). 

Currently this module only searches for 1 meter DEM products avilable for [most areas in the United States](https://index.nationalmap.gov/arcgis/rest/services/3DEPElevationIndex/MapServer/export?bbox=-15457537.49599047%2C2730261.224595605%2C-5693165.75473151%2C6428590.40114459&bboxSR=102100&imageSR=102100&size=1497%2C567&dpi=144&format=png32&transparent=true&layers=show%3A1&f=image), but this can easily be modified in the [query sent to TNM](https://github.com/tcallsen/tnm-3dep-downloader/blob/main/src/api.ts#L60).

## Development

### Install

```
nvm use
npm install
```

### Build

```
npm run build
```

### Test

```
npm test
```

### Repository and Tooling

This module was developed with Node.js v18 LTS using TypeScript and Jest for tests. The repository structure and configuration is based largely on the [microsoft/TypeScript-Node-Starter](https://github.com/microsoft/TypeScript-Node-Starter/tree/master) repo.