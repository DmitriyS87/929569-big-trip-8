import {getNewChart, deleteChart} from './chart';
import arrayLodash from 'lodash/array';

const BAR_HEIGHT = 100;

const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

const updateStats = (currentPoints) => {

  if (transportStat && moneyStat && timeSpendStat) {
    deleteChart(moneyStat);
    deleteChart(transportStat);
    deleteChart(timeSpendStat);
  }

  const getTransportStats = (points) => {
    const transform = (array) => {
      return array[0];
    };
    const arrayResult = arrayLodash.uniqBy(points.map((point, index, array) => {
      return [`${point.type.icon} ${point.type.type}`, array.filter((item) => {
        return item.type.type === point.type.type;
      }).length];
    }), transform).sort((a, b) => {
      if (a[1] < b[1]) {
        return 1;
      }
      return -1;
    });

    const result = {
      type: [],
      count: []
    };
    arrayResult.forEach((item) => {
      result.type.push(item[0]);
      result.count.push(item[1]);
    });

    return result;
  };

  const getMoneyStats = (points) => {
    const transform = (array) => {
      return array[0];
    };
    const arrayResult = arrayLodash.uniqBy(points.map((point, index, array) => {
      if (point !== null) {
        return [`${point.type.icon} ${point.type.type}`, array.filter((item) => {
          return item.type.type === point.type.type;
        }).reduce((a, b) => {
          return a + b.price.count;
        }, 0)];
      }
      return null;
    }), transform).sort((a, b) => {
      if (a[1] < b[1]) {
        return 1;
      }
      return -1;
    });

    const result = {
      type: [],
      count: []
    };

    arrayResult.forEach((item) => {
      result.type.push(item[0]);
      result.count.push(item[1]);
    });

    return result;
  };

  const getTimeSpendStats = (points) => {
    const getReducedUniquePoints = (array) => {
      for (let i = 1; i < array.length; i++) {
        if (array[i][0] === array[i - 1][0]) {
          array[i][1] += array[i - 1][1];
          array.splice(i - 1, 1, null);
        }
      }
      return arrayLodash.compact(array);
    };
    const mapedArrayPoints = points.map((point) => {
      const parseTimeMinets = (text) => {
        if (text !== 0 && text !== undefined) {
          return text.replace(/[HM]/ig, ``).trim().match(/\d(\d)*/ig, ` `).reduce((d, e) => {
            return d * 60 + +e;
          }, 0);
        }
        return 0;
      };
      const duration = parseTimeMinets(point.duration);
      return [`${point.type.icon} ${point.type.type}`, duration];
    }).sort();
    const arrayResult = getReducedUniquePoints(mapedArrayPoints).sort((a, b) => {
      if (a[1] < b[1]) {
        return 1;
      }
      return -1;
    }).map((it) => {
      it[1] = Math.round(it[1] / 60);
      return it;
    });

    const result = {
      type: [],
      count: []
    };

    arrayResult.forEach((item) => {
      result.type.push(item[0]);
      result.count.push(item[1]);
    });

    return result;
  };

  const transportData = getTransportStats(currentPoints);
  const MoneyData = getMoneyStats(currentPoints);
  const newTimeSpendStats = getTimeSpendStats(currentPoints);

  moneyCtx.height = BAR_HEIGHT * ((MoneyData.type.length > 5) ? 6 : 3);
  transportCtx.height = BAR_HEIGHT * ((transportData.type.length > 5) ? 6 : 3);
  timeSpendCtx.height = BAR_HEIGHT * ((newTimeSpendStats.type.length > 5) ? 6 : 3);

  const formatMoney = (val) => {
    return `€ ${val}`;
  };
  const formatTransport = (val) => {
    return `${val}x`;
  };
  const formatTimeSpend = (val) => {
    return `${val}H`;
  };

  transportStat = getNewChart(transportCtx, transportData.type, transportData.count, `TRANSPORT`, formatTransport);
  moneyStat = getNewChart(moneyCtx, MoneyData.type, MoneyData.count, `MONEY`, formatMoney);
  timeSpendStat = getNewChart(timeSpendCtx, newTimeSpendStats.type, newTimeSpendStats.count, `TIME SPENT`, formatTimeSpend);
};


let transportStat;
let moneyStat;
let timeSpendStat;

export {updateStats};
