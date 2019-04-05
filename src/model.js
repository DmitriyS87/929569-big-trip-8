import {EventEmitter} from './event-emitter';
import moment from 'moment';

class Model extends EventEmitter {
  constructor() {
    super();
  }
  set points(array) {
    this._points = array.map((it) => {
      it.date = moment(it.timeRange.startTime).format(`DD MMM`);
      it.duration = this._addDuration(it);
      it.totalPrice = this._countPrice(it);
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

  set destinationsList(array) {
    this._destinationsList = array.map((it) => {
      return it.name;
    });
    this.emit(`DestinationsLoaded`);
  }

  get destinationsList() {
    return this._destinationsList;
  }

  set allDestinations(array) {
    this._allDestinations = array;
    this.destinationsList = this._allDestinations;
  }

  get _destinationData() {
    return this._currentDestinationData;
  }

  set _destinationData(name) {
    const destinationData = this._allDestinations.find((it) => {
      return it.name === name;
    });
    this._currentDestinationData = destinationData ? destinationData : {description: ``, pictures: []};
  }

  savePoint(newData) {
    newData.duration = this._addDuration(newData);
    newData.totalPrice = this._countPrice(newData);
    newData.date = moment(newData.timeRange.startTime).format(`DD MMM`);
    this._points.splice(this._points.indexOf(this._points.find((it) => {
      return it.id === newData.id;
    })), 1, newData);
    this.emit(`pointSaved`, newData);
  }

  _addDuration(point) {
    const duration = moment.duration(moment(point.timeRange.endTime) - moment(point.timeRange.startTime));
    return `${duration.get(`days`) * 24 + duration.get(`hours`)}H ${duration.get(`minutes`)}M`;
  }

  _countPrice(point) {
    if (point.offers.length > 0) {
      return point.price.count + point.offers.filter((offer) => {
        return offer.checked;
      }).reduce((a, b) => {
        return a + b.price;
      }, 0);
    }
    return point.price.count;
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

  set baseOffersTypes(array) {
    this._baseOffersTypes = array.map((it) => {
      return it.type;
    });
  }

  set currentType(type) {
    this._currentType = type;
  }

  get currentTypeOffers() {
    if (this._offers instanceof Array && this._currentType) {
      const currentOffer = this._offers.filter((it) => {
        return it.type === this._currentType;
      });
      if (currentOffer.length > 0) {
        const arrayOffer = currentOffer[0].offers.map((offer) => {
          return {
            title: offer.name,
            price: offer.price
          };
        });
        return arrayOffer;
      }
    }
    return [];
  }
}

export {Model};
