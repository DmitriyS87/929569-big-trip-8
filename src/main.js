import makeFilters from './filter';
import {renderHTML} from './utils';
import {clearHTMLInside} from './utils';
import {renderObject as renderComponent} from './utils';
import data from './data.js';
import TripPoint from './trip-point';
import TripPointDetailed from './trip-point-detailed';

const moment = require(`moment`);
const FILTER_FORM_CLASS = `.trip-filter`;
const TRIP_DAY_CLASS = `.trip-day__items`;


const FILTERS_DATA = [{
  textFilter: `Everything`,
  condition: `checked`
},
{
  textFilter: `Future`
},
{
  textFilter: `Past`
}];

const getArrayPoints = (count) => {
  let arrayPoints = [];
  for (let index = 0; index < count; index++) {
    let dataElement = data();
    let tripPoint = new TripPoint(dataElement);
    let tripPointDetailed = new TripPointDetailed(dataElement);
    tripPoint.onClickPoint = () => {
      tripPointDetailed.render();
      document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPointDetailed.element, tripPoint.element);
      tripPoint.unrender();
    };
    tripPointDetailed.onSaveClick = (newData) => {
      dataElement.city = newData.city;
      dataElement.type = newData.type;
      dataElement.price = newData.price;
      dataElement.offers = newData.offers;
      dataElement.timeTable = newData.timeTable;
      const duration = moment.duration(moment(newData.timeTable.endTime, `HH:mm`) - moment(newData.timeTable.startTime, `HH:mm`));
      dataElement.duration = `${duration.get(`H`)}H ${duration.get(`M`)}M`;

      tripPoint.update(dataElement);
      tripPoint.render();
      document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPoint.element, tripPointDetailed.element);
      tripPointDetailed.unrender();
    };
    tripPointDetailed.onDelete = () => {
      tripPoint.render();
      document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPoint.element, tripPointDetailed.element);
      tripPointDetailed.unrender();
    };

    document.querySelector(TRIP_DAY_CLASS).appendChild(tripPoint.render());
  }
  return arrayPoints;
};

const tripsDefaultCount = 7;


clearHTMLInside(FILTER_FORM_CLASS);

const onClickFilter = () => {
  clearHTMLInside(TRIP_DAY_CLASS);
  const filterCount = Math.floor(Math.random() * arrayPoints.length);
  const filtredPoints = arrayPoints.slice(0, filterCount);
  renderHTML(filtredPoints.join(` `), TRIP_DAY_CLASS);
};

renderComponent(makeFilters(FILTERS_DATA, onClickFilter), FILTER_FORM_CLASS);

clearHTMLInside(TRIP_DAY_CLASS);
const arrayPoints = getArrayPoints(tripsDefaultCount);

