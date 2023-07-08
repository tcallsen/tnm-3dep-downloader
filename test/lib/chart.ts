import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import fs from 'fs';

const width = 4096;
const height = 1024;
const backgroundColour = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

async function getChartDataUrl (inputDataArray, dataLabels?) {
  const labels = inputDataArray[0].map((element,idx) => {
    return idx + 1;
  });
  const data = {
    labels: labels,
    datasets: inputDataArray.map((dataItem, idx) => {
      return {
        label: dataLabels[idx] || `data-${idx+1}`,
        data: dataItem,
        fill: false,
        borderColor: `rgb(75, ${190 - (idx * 50)}, ${90 + (idx * 50)})`, // vary colors
        tension: 0.1
      };
    })
  };

  const config = {
    type: 'line',
    data: data,
  };

  // 3rd level meta comment to allow other comments
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const dataUrl = await chartJSNodeCanvas.renderToDataURL(config);
  return dataUrl;
}

export async function writeImageFile(filePath, data, dataLabels?) {
  let base64Data = await getChartDataUrl(data, dataLabels);
  base64Data = base64Data.replace(/^data:image\/png;base64,/, '');

  fs.writeFileSync(filePath, base64Data, 'base64');
}