import fs from 'fs';
import { DOMParser } from 'xmldom';
import * as toGeoJSON from '@tmcw/togeojson';
import { Feature, Polygon, LineString } from '@turf/helpers';
import envelope from '@turf/envelope';

export function loadGpxData(path: string): Feature<LineString> {
  const file = fs.readFileSync(path, 'utf8');
  const gpxDoc = new DOMParser().parseFromString(file);
  const gpxGeoJson = toGeoJSON.gpx(gpxDoc);
  return gpxGeoJson.features[0];
}

export function getGpxBoundingBox(gpxFeature: Feature<LineString>): Feature<Polygon> {
  return envelope(gpxFeature);
}