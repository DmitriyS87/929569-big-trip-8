import makeFilters from './filter';
import {renderHTML} from './utils';
import {clearHTMLInside} from './utils';
import {renderObject as renderComponent} from './utils';
import makePointHtml from './trip-point';
import data from './data.js';
import {TripPoint} from './trip-point-class';

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
    let tripPointElement = new TripPoint(dataElement);
    document.querySelector(TRIP_DAY_CLASS).appendChild(tripPointElement.render());
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
// renderHTML(arrayPoints.join(` `), TRIP_DAY_CLASS);
