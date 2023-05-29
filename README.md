# The National Map 3DEP Product Downloader

Simple module that queries [The National Map](https://apps.nationalmap.gov/) for 3DEP elevation products (GeoTIFF) based on a supplied bounding box. Currently only returns 1 meter DEM products avilable for [most areas in the United States](https://index.nationalmap.gov/arcgis/rest/services/3DEPElevationIndex/MapServer/export?bbox=-15457537.49599047%2C2730261.224595605%2C-5693165.75473151%2C6428590.40114459&bboxSR=102100&imageSR=102100&size=1497%2C567&dpi=144&format=png32&transparent=true&layers=show%3A1&f=image).

To be continued..

## API Spec

This module is coded to follow the National Map API spec [documented here](https://apps.nationalmap.gov/help/documents/TNMAccessAPIDocumentation/TNMAccessAPIDocumentation.pdf). 

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