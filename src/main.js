
import {clearHTMLInside} from './utils';
import {Model} from './model';
import {Controller} from './controller';
import {View} from './view';

const TRIP_DAY_CLASS = `.trip-day__items`;
const FILTER_FORM_CLASS = `.trip-filter`;

clearHTMLInside(FILTER_FORM_CLASS);
const tripDayelement = document.querySelector(TRIP_DAY_CLASS);
const filterContainer = document.querySelector(FILTER_FORM_CLASS);

const model = new Model();
const view = new View(model, tripDayelement, filterContainer);
const controller = new Controller(model, view);
controller.init();
