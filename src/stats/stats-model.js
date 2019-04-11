import ChartView from './chart-view';
import {EventEmitter} from '../event-emitter';
import chartsConfig from './charts-config';

class StatsModel extends EventEmitter {
  constructor(model) {
    super();
    this._charts = [];
    this._model = model;
    model.on(`pointsLoaded`, () => {
      this.init();
    });

    model.on(`pointsChanged`, () => {
      this.update();
    });
  }

  init() {
    this._makeCharts();
    this.update();
  }
  _makeCharts() {
    for (let config of chartsConfig) {
      let chartView = new ChartView(this, config);
      this._charts.push({
        name: config.name,
        chart: chartView
      });
    }
    if (this._charts.length > 0) {
      this.emit(`statsInit`);
    }
  }

  _countData(chartName) {
    const chartData = this._countStats(this._points, chartsConfig.find((it) => {
      return it.name === chartName;
    }));
    return chartData;
  }

  getChartData(name) {
    return this._charts.find((it) => {
      return it.name === name;
    }).data;
  }


  update() {
    this._setData();
    for (let chart of this._charts) {
      chart.data = this._countData(chart.name);
    }
    this.emit(`statsDataUpdated`);
  }

  _setData() {
    this._points = this._model.exportPoints;
  }

  _countStats(points, config) {
    const arrayResults = points.map((point) => {
      return {type: `${point.type.icon} ${point.type.type}`, count: config.countStat(points, point)};
    });

    const result = {
      types: new Set(),
      counts: []
    };
    arrayResults.sort((a, b) => {
      if (a.count < b.count) {
        return 1;
      }
      return -1;
    }).forEach((item) => {
      if (!result.types.has(item.type)) {
        result.counts.push(item.count);
        result.types.add(item.type);
      }
    });
    result.types = [...result.types];

    return result;
  }

}

export default StatsModel;
