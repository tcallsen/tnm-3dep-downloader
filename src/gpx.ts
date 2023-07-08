import fs from 'fs';
import { DOMParser } from 'xmldom';
import * as toGeoJSON from '@tmcw/togeojson';

export function loadGpxData(path: string) {
  const file = fs.readFileSync(path, 'utf8');
  const gpxDoc = new DOMParser().parseFromString(file);
  const gpxGeoJson = toGeoJSON.gpx(gpxDoc);
  return gpxGeoJson.features[0];
}