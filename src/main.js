import {Filter} from './filter';
import {clearHTMLInside} from './utils';
import data from './data.js';
import TripPoint from './trip-point';
import TripPointDetailed from './trip-point-detailed';
import {getNewChart, deleteChart} from './statistic';

const arrayLodash = require(`lodash`);
const moment = require(`moment`);

const BAR_HEIGHT = 100;

const FILTER_FORM_CLASS = `.trip-filter`;
const TRIP_DAY_CLASS = `.trip-day__items`;

const FILTERS_DATA = [{
  textFilter: `Everything`,
  doFilter(point) {
    if (point !== null) {
      point.display = true;
    }
    return point;
  }
},
{
  textFilter: `Future`,
  doFilter(point) {
    if (point !== null) {
      if (moment().isBefore(moment(point.date, `DD MMM`))) {
        point.display = true;
        return point;
      }
      point.display = false;
      return point;
    }
    return null;
  }
},
{
  textFilter: `Past`,
  doFilter(point) {
    if (point !== null) {
      if (moment(point.date, `DD MMM`).isBefore(moment())) {
        point.display = true;
        return point;
      }
      point.display = false;
      return point;
    }
    return null;
  }
}];

const generateArrayPointsData = (count) => {
  const arrayData = [];
  for (let index = 0; index < count; index++) {
    arrayData.push(data());
    arrayData[index].display = true;
  }
  return arrayData;
};

const renderPoints = (arrayPointsData) => {
  const arrayPoints = [];
  for (let pointData of arrayPointsData) {
    if (pointData !== null) {
      const tripPoint = new TripPoint(pointData);
      const tripPointDetailed = new TripPointDetailed(pointData);
      tripPoint.onClickPoint = () => {
        tripPointDetailed.render();
        document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPointDetailed.element, tripPoint.element);
        tripPoint.unrender();
      };
      tripPointDetailed.onSaveClick = (newData) => {
        pointData.city = newData.city;
        pointData.type = newData.type;
        pointData.price = newData.price;
        pointData.offers = newData.offers;
        pointData.timeRange = newData.timeRange;
        // pointData = Object.assign(newData);
        tripPoint.update(pointData);
        tripPoint.render();
        document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPoint.element, tripPointDetailed.element);
        tripPointDetailed.unrender();
      };
      tripPointDetailed.onDelete = () => {
        pointData = null;
        tripPointDetailed.element.remove();
        tripPointDetailed.unrender();
      };

      document.querySelector(TRIP_DAY_CLASS).appendChild(tripPoint.render());
      arrayPoints.push(tripPoint);
    }
  }

  return arrayPoints;
};

const tripsDefaultCount = 7;


clearHTMLInside(FILTER_FORM_CLASS);

const arrayFilters = [];

clearHTMLInside(TRIP_DAY_CLASS);
const pointsData = generateArrayPointsData(tripsDefaultCount);
const arrayPoints = renderPoints(pointsData);


for (let filterData of FILTERS_DATA) {
  let filter = new Filter(filterData);
  filter.onFilter = () => {
    clearHTMLInside(TRIP_DAY_CLASS);
    arrayPoints.forEach((point) => {
      if (point.element !== null) {
        point.unrender();
        filter.doFilter(point);
        document.querySelector(TRIP_DAY_CLASS).appendChild(point.render());
      }
    });
  };
  document.querySelector(FILTER_FORM_CLASS).appendChild(filter.render());
  arrayFilters.push(filter.element);
}

const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

const updateStats = (currentPoints) => {
  const points = arrayLodash.compact(currentPoints);

  if (transportStat && moneyStat && timeSpendStat) {
    deleteChart(moneyStat);
    deleteChart(transportStat);
    deleteChart(timeSpendStat);
  }

  const getTransportStats = () => {
    const transform = (array) => {
      return array[0];
    };
    const arrayResult = arrayLodash.uniqBy(points.map((point, index, array) => {
      return [`${point.type.icon} ${point.type.type}`, array.filter((item) => {
        return item.type === point.type;
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

  const getMoneyStats = () => {
    const transform = (array) => {
      return array[0];
    };
    const arrayResult = arrayLodash.uniqBy(points.map((point, index, array) => {
      if (point !== null) {
        return [`${point.type.icon} ${point.type.type}`, array.filter((item) => {
          return item.type === point.type;
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

  const getTimeSpendStats = () => {
    const getAdditionedSamesArray = (array) => {
      for (let i = 1; i < array.length; i++) {
        if (array[i][0] === array[i - 1][0]) {
          array[i][1] += array[i - 1][1];
          array.splice(i - 1, 1);
        }
      }
      return array;
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
    const arrayResult = getAdditionedSamesArray(mapedArrayPoints).sort((a, b) => {
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

  const transportData = getTransportStats();
  const MoneyData = getMoneyStats();
  const newTimeSpendStats = getTimeSpendStats();

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

const onStatsClick = (evt) => {
  evt.preventDefault();
  const activeElement = document.querySelector(`.view-switch__item--active`);
  if (evt.target !== activeElement) {
    activeElement.classList.remove(`view-switch__item--active`);
    evt.target.classList.add(`view-switch__item--active`);
    const pointsContainer = document.querySelector(`.main`);
    const statsContainer = document.querySelector(`.statistic`);

    pointsContainer.classList.toggle(`visually-hidden`);
    statsContainer.classList.toggle(`visually-hidden`);

    if (!statsContainer.classList.contains(`visually-hidden`)) {
      updateStats(pointsData);
    }
  }
};

let transportStat;
let moneyStat;
let timeSpendStat;

Array.from(document.querySelectorAll(`.view-switch__item`)).forEach((switchLink) => {
  switchLink.addEventListener(`click`, onStatsClick);
});
