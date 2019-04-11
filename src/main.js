
import Model from './model';
import Controller from './controller';
import Table from './table';
import Store from './store';
import Provider from './provider';

const TRIP_DAY_CLASS = `.trip-day__items`;

const tripDayelement = document.querySelector(TRIP_DAY_CLASS);

const model = new Model();
const view = new Table(model, tripDayelement);
const controller = new Controller(model, view);
controller.init();

const store = new Store();
const provider = new Provider();
