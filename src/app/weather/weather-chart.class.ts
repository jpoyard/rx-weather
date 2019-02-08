import { Chart } from 'chart.js';
import { Daily } from '../utility';

export class WeatherChart {
  private context: CanvasRenderingContext2D;
  private chart: Chart;
  constructor(private canvas: HTMLCanvasElement) {
    this.context = this.canvas.getContext('2d');
    const settings = require('./chart-settings.json');
    this.chart = new Chart(this.context, settings);
  }

  destroy() {
    this.chart.clear();
    this.chart.destroy();
  }

  update(data: Daily[]) {
    this.chart.data = {
      labels: data.map((daily, index) => `${index}`),
      datasets: [
        {
          label: 'max',
          data: data.map(daily => daily.temp.max),
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255,99,132,1)'],
          borderWidth: 1
        },
        {
          label: 'min',
          data: data.map(daily => daily.temp.min),
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }
      ]
    };
    this.chart.update();
  }
}
