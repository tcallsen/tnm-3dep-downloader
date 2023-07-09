import fs from 'fs';
import path from 'path';

// https://github.com/tcallsen/geoCalcLineElevation/blob/master/gpxCalcElevationGain.js#LL29C3-L36C23
export function calculateElevation(elevationArray: number[]): number {
  let elevationGain = 0;
  // let lastRecordedElevation = 0;
  elevationArray.forEach( (elevation, index) => {
    if (index == elevationArray.length - 1) return; // stop 1 point early since comparison requires 2 points
    const elevationDifference = elevationArray[index+1] - elevationArray[index];
    // if (Math.abs(lastRecordedElevation - elevationArray[index+1]) > .25) {
      if (elevationDifference > 0) {
        elevationGain += elevationDifference;
      }
    //   lastRecordedElevation = elevationArray[index+1];
    // }
  });

  return elevationGain;
}

export function writeToCsv(inputPath, elevationArray) {
  const fullPath = path.resolve(inputPath);
  const writeStream = fs.createWriteStream(fullPath);
  writeStream.write(elevationArray.join(','));
}