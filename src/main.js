import makeFilters from './filter';
import {renderHTML} from './utils';
import {clearHTMLInside} from './utils';
import {renderObject as renderComponent} from './utils';
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

const collectItems = (buildItem, count) => {
  let itemsCollection = ``;
  for (let index = 0; index < count; index++) {
    itemsCollection += buildItem();
  }
  return itemsCollection;
};

const tripsDefaultCount = 7;

const FILTER_FORM_CLASS = `.trip-filter`;
const TRIP_DAY_CLASS = `.trip-day__items`;

clearHTMLInside(FILTER_FORM_CLASS);

const onClickFilter = () => {
  clearHTMLInside(TRIP_DAY_CLASS);
  renderHTML(collectItems(makePointHtml.bind(this, tripsData), Math.round(Math.random() * 10)), TRIP_DAY_CLASS);
};

renderComponent(makeFilters(FILTERS_DATA, onClickFilter), FILTER_FORM_CLASS);

clearHTMLInside(TRIP_DAY_CLASS);

renderHTML(collectItems(makePointHtml.bind(this, tripsData), tripsDefaultCount), TRIP_DAY_CLASS);
