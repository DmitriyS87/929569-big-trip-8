import {EventEmitter} from './event-emitter';
import {Loader} from './loader';
import {DataParser} from './data-parser';
import moment from 'moment';

const ENTRY = `https://es8-demo-srv.appspot.com/big-trip/`;
const VAILD_SYMBOLS = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;


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

class Model extends EventEmitter {
  constructor() {
    super();
  }
  set points(array) {
    this._points = array.map((it) => {
      it.duration = this._addDuration(it);
      it.price.count = this._countPrice(it);
      return it;
    });
  }
  get points() {
    if (this._points instanceof Array) {
      return this._points;
    }
    return [];
  }

  loadPoints() {
    const getPoints = new Loader(ENTRY, getKey());
    getPoints.getData(`points`)
      .then((data) => {
        return DataParser.parsePoints(data);
      })
      .then((array) => {
        this.points = array;
        this.emit(`pointsLoaded`);
      });
  }

  savePoint(newData) {
    newData.duration = this._addDuration(newData);
    this._points.splice(this._points.indexOf(this._points.find((it) => {
      return it.id === newData.id;
    })), 1, newData);
    this.emit(`pointSaved`, newData);
  }

  _addDuration(point) {
    const duration = moment.duration(moment(point.timeRange.endTime) - moment(point.timeRange.startTime));
    return `${duration.get(`hours`)}H ${duration.get(`minutes`)}M`;
  }

  _countPrice(point) {
    if (point.offers.length > 0) {
      return point.basePrice + point.offers.filter((offer) => {
        return offer.checked;
      }).reduce((a, b) => {
        return a + b.price;
      }, 0);
    }
    return point.basePrice;
  }

  deletePoint(id) {
    this._points.splice(this._points.indexOf(this._points.find((it) => {
      return it.id === id;
    })), 1);
    this.emit(`pointDeleted`, id);
  }

  set destinations(array) {
    this._destinations = array;
    this.emit(`destinationsLoaded`);
  }

  get destinationsNames() {
    return this._destinations.map((it) => {
      return it.name;
    });
  }


  set currentDestination(name) {
    this._currentDestination = name;
    this.emit(`destinationSelected`, name);
  }


  get currentDestinationData() {
    if (this._destinations instanceof Array && this._currentDestination) {
      return this._destinations.filter((it) => {
        return it.name === this._currentDestination.name;
      });
    }
    return [];
  }

  set offers(array) {
    this._offers = array;
    this.emit(`offersLoaded`);
  }

  set currentType(type) {
    this._currentType = type;
    this.emit(`typeChacked`);
  }

  get currentTypeOffers() {
    if (this._offers instanceof Array && this._currentType) {
      return this._offers.filter((it) => {
        return it.type === this._currentType;
      }).offers;
    }
    return [];
  }
}

export {Model};
