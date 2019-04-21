import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {EventEmitter} from '../event-emitter';

const DATASETS_BASE_INDEX = 0;

class ChartView extends EventEmitter {
  constructor(chartModel, options) {
    super();
    this._model = chartModel;
    this._chart = null;

    this._baseOptions = {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: ``
          }
        },
        title: {
          display: true,
          text: `nameChart`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    };

    this._additionalOptions = options;

    this._onUpdate = () => {
      return this._update();
    };

    this._onInit = () => {
      this._makeChart();
    };
    chartModel.on(`statsDataUpdated`, this._onUpdate);
    chartModel.on(`statsInit`, this._onInit);
  }

  _makeChart() {
    this._setAdditionalOptions();
    this._chart = new Chart(this._additionalOptions.ctx, this._baseOptions);
  }

  _setAdditionalOptions() {
    this._baseOptions.options.plugins.datalabels.formatter = this._additionalOptions.format;
    this._baseOptions.options.title.text = this._additionalOptions.name;
  }

  _update() {
    const data = this._model.getChartData(this._additionalOptions.name); //
    this._chart.data.labels = data.types;
    this._chart.data.datasets[DATASETS_BASE_INDEX].data = data.counts;
    this._chart.update();
  }
}

export default ChartView;
