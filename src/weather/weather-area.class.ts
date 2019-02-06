import { WeatherChart } from './weather-chart.class';
import { ForecastDaily, WeatherPosition, Commune } from '../utility';

export class WeatherArea {
  private component: HTMLElement;
  private shadowroot: ShadowRoot;
  private weatherChart: WeatherChart;

  constructor(private container: HTMLElement) {
    this.init();
  }

  public init() {
    this.component = document.createElement('DIV');
    this.shadowroot = this.component.attachShadow({ mode: 'open' });
    this.container.appendChild(this.component);
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
    if (this.weatherChart) {
      this.weatherChart.destroy();
      delete this.weatherChart;
    }

    const canvasId = 'canvasChartId';
    this.shadowroot.innerHTML = `
    <style>${require('./weather-area.css')}</style>
    <div class="container">
      <div class="infos">
        <h1>${town.nom}</h1>
        <div class="temperature">
          <div class="temperature">Temperature: ${
            weatherPosition.main.temp
          }°C</div>
          <div class="temperature-max">max: ${
            weatherPosition.main.temp_max
          }°C</div>
          <div class="temperature-min">min: ${
            weatherPosition.main.temp_min
          }°C</div>
        </div>
        <div class="position">
          <div class="latitude">latitude: ${weatherPosition.coord.lat}</div>
          <div class="longitude">longitude: ${weatherPosition.coord.lon}</div>
        </div>
        <img src="//openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${
          weatherPosition.weather[0].icon
        }.png"
          width="128"
          height="128"
          alt="Weather in ${town.nom}"/>
      </div>
      <canvas id="${canvasId}"></canvas>
    </div>
`;
    this.weatherChart = new WeatherChart(this.shadowroot.getElementById(
      canvasId
    ) as HTMLCanvasElement);

    this.weatherChart.update(forecastDaily.list);
  }
}
