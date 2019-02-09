import { WeatherChart } from './weather-chart.class';
import { ForecastDaily, WeatherPosition, Commune } from '../utility';

/** create template */

let tmpl = document.createElement('template');

tmpl.innerHTML = `
<style>${require('./weather-info.element.css')}</style>
<div class="container">
  <div class="infos">
    <h1>XXX</h1>
    <div class="temperature-list">
      <div class="temperature">Temperature: <i>XXX</i>°C</div>
      <div class="temperature-max">max: <i>XXX</i>°C</div>
      <div class="temperature-min">min: <i>XXX</i>°C</div>
    </div>
    <div class="position">
      <div class="latitude">latitude: <i>XXX</i></div>
      <div class="longitude">longitude: <i>XXX</i></div>
    </div>
    <img src=""
      width="128"
      height="128"
      alt="XXX"/>
  </div>
  <canvas id="canvasChartId"></canvas>
</div>
`;

export class WeatherInfoElement extends HTMLElement {
  private static readonly CANVAS_ID = 'canvasChartId';
  private static readonly IMG_PATH =
    '//openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets';

  private shadow: ShadowRoot;
  private weatherChart: WeatherChart;

  set townName(name: string) {
    this.shadow.querySelector('h1').innerHTML = name;
    this.shadow.querySelector('img').alt = `Weather in ${name}`;
  }

  set temperature(value: number) {
    this.shadow.querySelector('.temperature i').innerHTML = Number(
      value
    ).toString();
  }

  set temperatureMax(value: number) {
    this.shadow.querySelector('.temperature-max i').innerHTML = Number(
      value
    ).toString();
  }

  set temperatureMin(value: number) {
    this.shadow.querySelector('.temperature-min i').innerHTML = Number(
      value
    ).toString();
  }

  set latitude(value: number) {
    this.shadow.querySelector('.latitude i').innerHTML = Number(
      value
    ).toString();
  }

  set longitude(value: number) {
    this.shadow.querySelector('.longitude i').innerHTML = Number(
      value
    ).toString();
  }

  set icon(value: string) {
    this.shadow.querySelector('img').src = `${
      WeatherInfoElement.IMG_PATH
    }/${value}.png`;
  }

  constructor() {
    super();
  }

  public init() {
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(tmpl.content.cloneNode(true));
  }

  public update({
    town,
    weatherPosition,
    forecastDaily
  }: {
    town: Commune;
    weatherPosition: WeatherPosition;
    forecastDaily: ForecastDaily;
  }) {
    if (!this.shadow) {
      this.init();
    }
    if (this.weatherChart) {
      this.weatherChart.destroy();
      delete this.weatherChart;
    }
    this.weatherChart = new WeatherChart(this.shadow.getElementById(
      WeatherInfoElement.CANVAS_ID
    ) as HTMLCanvasElement);

    // update displayed values
    this.townName = town.nom;
    this.temperature = weatherPosition.main.temp;
    this.temperatureMin = weatherPosition.main.temp_min;
    this.temperatureMax = weatherPosition.main.temp_max;
    this.latitude = weatherPosition.coord.lat;
    this.longitude = weatherPosition.coord.lon;
    this.icon = weatherPosition.weather[0].icon;

    this.weatherChart.update(forecastDaily.list);
  }
}
