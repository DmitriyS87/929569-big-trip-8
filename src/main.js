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

const generateArrayPoints = (count) => {
  const arrayPoints = [];
  for (let index = 0; index < count; index++) {
    arrayPoints.push(data());
  }
  return arrayPoints;
};

const renderPoints = (arrayPoints) => {
  for (let index = 0; index < arrayPoints.length; index++) {
    if (arrayPoints[index] !== null) {
      let tripPoint = new TripPoint(arrayPoints[index]);
      let tripPointDetailed = new TripPointDetailed(arrayPoints[index]);
      tripPoint.onClickPoint = () => {
        tripPointDetailed.render();
        document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPointDetailed.element, tripPoint.element);
        tripPoint.unrender();
      };
      tripPointDetailed.onSaveClick = (newData) => {
        arrayPoints[index].city = newData.city;
        arrayPoints[index].type = newData.type;
        arrayPoints[index].price = newData.price;
        arrayPoints[index].offers = newData.offers;
        arrayPoints[index].timeTable = newData.timeTable;
        const duration = moment.duration(moment(newData.timeTable.endTime, `HH:mm`) - moment(newData.timeTable.startTime, `HH:mm`));
        arrayPoints[index].duration = `${duration.get(`H`)}H ${duration.get(`M`)}M`;

        tripPoint.update(arrayPoints[index]);
        tripPoint.render();
        document.querySelector(TRIP_DAY_CLASS).replaceChild(tripPoint.element, tripPointDetailed.element);
        tripPointDetailed.unrender();
      };
      tripPointDetailed.onDelete = () => {
        arrayPoints[index] = null;
        tripPointDetailed.element.remove();
        tripPointDetailed.unrender();
      };

      document.querySelector(TRIP_DAY_CLASS).appendChild(tripPoint.render());
    }
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
const arrayPoints = generateArrayPoints(tripsDefaultCount);
renderPoints(arrayPoints);

