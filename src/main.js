
import {clearHTMLInside} from './utils';
import Model from './model';
import Controller from './controller';
import Table from './table';
import FiltersController from './filters/filters-controller';

const TRIP_DAY_CLASS = `.trip-day__items`;
const FILTER_FORM_CLASS = `.trip-filter`;

clearHTMLInside(FILTER_FORM_CLASS);
const tripDayelement = document.querySelector(TRIP_DAY_CLASS);
const filterContainer = document.querySelector(FILTER_FORM_CLASS);

const model = new Model();
const view = new Table(model, tripDayelement);
const controller = new Controller(model, view);

const filtersController = new FiltersController(model);
controller.init();
filtersController.init();
filtersController.filters.forEach((it) => {
  filterContainer.appendChild(it);
});

