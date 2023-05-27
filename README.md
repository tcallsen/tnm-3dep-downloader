# The National Map 3DEP Product Downloader

Simple module that queries [The National Map](https://apps.nationalmap.gov/) for 3DEP elevation products (GeoTIFF) based on a supplied bounding box. The highest resolution set of products available will be returned by default.

To be continued..

## API Spec

This module is coded to follow the National Map API spec [documented here](https://apps.nationalmap.gov/help/documents/TNMAccessAPIDocumentation/TNMAccessAPIDocumentation.pdf). 

## Development

### Install

```
nvm use
npm install
```

### Build / Execute

```
npm start
```

### Test

```
npm test
```

### Repository and Tooling

This module was developed with Node.js v18 LTS using TypeScript and Jest for tests. The repository structure and configuration is based largely on the [microsoft/TypeScript-Node-Starter](https://github.com/microsoft/TypeScript-Node-Starter/tree/master) repo.