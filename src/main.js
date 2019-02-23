import makeFilter from './filter';
import {render} from './utils';
import {clearHtmlInside} from './utils';

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

const FILTER_FORM_CLASS = `.trip-filter`;

const filtersHtml = FILTERS_DATA.reduce((html, item) => {
  return ((html !== 0) ? html : ``) + makeFilter(item);
}, 0);

clearHtmlInside(FILTER_FORM_CLASS);
render(filtersHtml, FILTER_FORM_CLASS);
