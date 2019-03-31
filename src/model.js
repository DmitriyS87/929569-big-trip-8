import {EventEmitter} from './event-emitter';
import moment from 'moment';
class Model extends EventEmitter {
  constructor() {
    super();
  }
  set points(array) {
    this._points = array.map((it) => {
      it = this._addDuration(it);
      return it;
    });
    this.emit(`pointsLoaded`);
  }
  get points() {
    if (this._points instanceof Array) {
      return this._points;
    }
    return [];
  }

  savePoint(newData) {
    newData = this._addDuration(newData);
    this._points.splice(this._points.indexOf(this._points.find((it) => {
      return it.id === newData.id;
    })), 1, newData);

    this.emit(`pointSaved`, newData);
  }

  _addDuration(point) {
    const duration = moment.duration(moment(point.timeRange.endTime) - moment(point.timeRange.startTime));
    point.duration = `${duration.get(`hours`)}H ${duration.get(`minutes`)}M`;
    return point;
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
