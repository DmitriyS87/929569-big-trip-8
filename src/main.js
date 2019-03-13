import makeFilters from './filter';
import {renderHTML} from './utils';
import {clearHTMLInside} from './utils';
import {renderObject as renderComponent} from './utils';
import makePointHtml from './trip-point';
import data from './data.js';

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
    arrayPoints.push(makePointHtml(data()));
  }
  return arrayPoints;
};

const tripsDefaultCount = 7;

const FILTER_FORM_CLASS = `.trip-filter`;
const TRIP_DAY_CLASS = `.trip-day__items`;

clearHTMLInside(FILTER_FORM_CLASS);

const arrayPoints = getArrayPoints(tripsDefaultCount);
const onClickFilter = () => {
  clearHTMLInside(TRIP_DAY_CLASS);
  const filterCount = Math.floor(Math.random() * arrayPoints.length);
  const filtredPoints = [];
  for (let i = 0; i < filterCount; i++) {
    filtredPoints.push(arrayPoints[i]);
  }
  renderHTML(filtredPoints.join(` `), TRIP_DAY_CLASS);
};

renderComponent(makeFilters(FILTERS_DATA, onClickFilter), FILTER_FORM_CLASS);

clearHTMLInside(TRIP_DAY_CLASS);

renderHTML(arrayPoints.join(` `), TRIP_DAY_CLASS);
