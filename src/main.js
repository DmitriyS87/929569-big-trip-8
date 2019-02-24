import makeFilter from './filter';
import {render} from './utils';
import {clearHtmlInside} from './utils';
import makePointHtml from './trip-point';

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

const tripsData = {
  icon: `✈️`,
  title: `Flight to Geneva`,
  timeTable: `10:00&nbsp;&mdash; 11:00`,
  duration: `1h 30m`,
  price: `&euro;&nbsp;20`,
  offers: [`Upgrade to business +&euro;&nbsp;20`, `Select meal +&euro;&nbsp;20`]
};

const FILTER_FORM_CLASS = `.trip-filter`;
const TRIP_DAY_CLASS = `.trip-day__items`;

const filtersHtml = FILTERS_DATA.reduce((html, item) => {
  return ((html !== 0) ? html : ``) + makeFilter(item);
}, 0);

clearHtmlInside(FILTER_FORM_CLASS);
render(filtersHtml, FILTER_FORM_CLASS);

clearHtmlInside(TRIP_DAY_CLASS);
render(makePointHtml(tripsData), TRIP_DAY_CLASS);
