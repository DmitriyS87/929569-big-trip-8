
import {clearHTMLInside} from './utils';
import {Loader} from './loader';

import {Model} from './model';
import {Controller} from './controller';
import {View} from './view';

const ENTRY = `https://es8-demo-srv.appspot.com/big-trip/`;
const VAILD_SYMBOLS = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;

const TRIP_DAY_CLASS = `.trip-day__items`;
const FILTER_FORM_CLASS = `.trip-filter`;

clearHTMLInside(FILTER_FORM_CLASS);
const tripDayelement = document.querySelector(TRIP_DAY_CLASS);
const filterContainer = document.querySelector(FILTER_FORM_CLASS);

const model = new Model();
const view = new View(model, tripDayelement, filterContainer);
const controller = new Controller(model, view);
controller.init();

const makeRandomCountMinMax = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomString = (validSymbols, length) => {
  return Array(length).join().split(`,`).map(() => {
    return validSymbols[Math.floor(Math.random() * validSymbols.length)];
  }).join(``);
};

const getKey = () => {
  return `Basic ${getRandomString(VAILD_SYMBOLS, makeRandomCountMinMax(8, 16))}`;
};

/* .then((points) => {
  // console.log(points.map((it) => it.offers));
  return DataParser.parsePoints(points);
})*/


const getDestinations = new Loader(ENTRY, getKey());
getDestinations.getData(`destinations`)
.then((array) => {
  console.log(array);
});

