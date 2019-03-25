import {Filter} from './filter';
import {clearHTMLInside} from './utils';
import data from './data.js';
import TripPoint from './trip-point';
import TripPointDetailed from './trip-point-detailed';
import {moneyChart, transportChart} from './statistic';

const moment = require(`moment`);

const FILTER_FORM_CLASS = `.trip-filter`;
const TRIP_DAY_CLASS = `.trip-day__items`;


const FILTERS_DATA = [{
  textFilter: `Everything`,
  checked: true,
  doFilter(point) {
    if (point !== null) {
      point.display = true;
    }
    return point;
  }
},
{
  textFilter: `Future`,
  checked: false,
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
  checked: false,
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
  for (let index = 0; index < arrayPointsData.length; index++) {
    if (arrayPointsData[index] !== null) {
      let tripPoint = new TripPoint(arrayPointsData[index]);
      let tripPointDetailed = new TripPointDetailed(arrayPointsData[index]);
      tripPoint.onClickPoint = () => {
        tripPointDetailed.render();
        document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPointDetailed.element, tripPoint.element);
        tripPoint.unrender();
      };
      tripPointDetailed.onSaveClick = (newData) => {
        arrayPointsData[index].city = newData.city;
        arrayPointsData[index].type = newData.type;
        arrayPointsData[index].price = newData.price;
        arrayPointsData[index].offers = newData.offers;
        arrayPointsData[index].timeTable = newData.timeTable;
        const duration = moment.duration(moment(newData.timeTable.endTime, `HH:mm`) - moment(newData.timeTable.startTime, `HH:mm`));
        arrayPointsData[index].duration = `${duration.get(`H`)}H ${duration.get(`M`)}M`;

        tripPoint.update(arrayPointsData[index]);
        tripPoint.render();
        document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPoint.element, tripPointDetailed.element);
        tripPointDetailed.unrender();
      };
      tripPointDetailed.onDelete = () => {
        arrayPointsData[index] = null;
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
  }
};

Array.from(document.querySelectorAll(`.view-switch__item`)).forEach((switchLink) => {
  switchLink.addEventListener(`click`, onStatsClick);
});
