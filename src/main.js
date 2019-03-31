
import {clearHTMLInside} from './utils';
import data from './data.js';
import {Loader} from './loader';
import {DataParser} from './data-parser';


import {Model} from './model';
import {Controller} from './controller';
import {View} from './view';

const ENTRY = `https://es8-demo-srv.appspot.com/big-trip/`;
const VAILD_SYMBOLS = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;


const TRIP_DAY_CLASS = `.trip-day__items`;

const FILTER_FORM_CLASS = `.trip-filter`;

const generateArrayPointsData = (count) => {
  const arrayData = [];
  for (let index = 0; index < count; index++) {
    arrayData.push(data());
  }
  return arrayData;
};

const tripsDefaultCount = 7;


clearHTMLInside(FILTER_FORM_CLASS);
const tripDayelement = document.querySelector(TRIP_DAY_CLASS);
const filterContainer = document.querySelector(FILTER_FORM_CLASS);
const pointsData = generateArrayPointsData(tripsDefaultCount);
const model = new Model();
const view = new View(model, tripDayelement, filterContainer);
const controller = new Controller(model, view);
controller.init(pointsData);

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

/*
const getPoints = new Loader(ENTRY, getKey());
getPoints.getData(`points`)
.then((points) => {
  console.log(points);
  return DataParser.parsePoints(points);
})
.then((array) => {
  console.log(array);
});

const getDestinations = new Loader(ENTRY, getKey());
getDestinations.getData(`destinations`)
.then((array) => {
  console.log(array);
});
*/
