
import Model from './model';
import Controller from './controller';
import Table from './table';

const TRIP_DAY_CLASS = `.trip-day__items`;

const tripDayelement = document.querySelector(TRIP_DAY_CLASS);

const model = new Model();
const pointsTable = new Table(model, tripDayelement);
const controller = new Controller(model, pointsTable);
controller.init();

