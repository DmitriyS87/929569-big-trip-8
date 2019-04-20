import {EventEmitter} from './event-emitter';
import moment from 'moment';

class Model extends EventEmitter {
  constructor() {
    super();
    this._online = true;
  }
  set online(value) {
    this._online = value;
  }

  set points(array) {
    this._points = array.map((it) => {
      it.date = moment(it.timeRange.startTime).format(`MMM DD`);
      it.duration = this._addDuration(it);
      it.totalPrice = this._countPrice(it);
      return it;
    });
    this.exportPoints = this._points;
    this.emit(`pointsLoaded`); // check the way
  }
  get points() {
    if (this._points instanceof Array) {
      return this._points;
    }
    return [];
  }

  getNewPointData() {
    const defaultData = {
      date: moment().format(`MMM DD`),
      id: String(Math.max(...this._points.map((point) => {
        return Number(point.id);
      })) + 1),
      type: {type: ``,
        icon: ``},
      timeRange: {
        startTime: moment(),
        endTime: moment()
      },
      description: ``,
      city: ``,
      pictures: [],
      isFavorite: false,
      offers: [],
      price: {count: 0},
      totalPrice: 0
    };
    console.log(defaultData);
    return defaultData;
  }

  set exportPoints(points) {
    this._exportPoints = points;
    this._exportTables = this._makeTablesData(this._exportPoints);
    this.totalCost = `€ ${this._countTotalCost()}`;
    this.emit(`pointsChanged`);
  }

  updateExport() {
    this.exportPoints = this._points;
  }

  set totalCost(cost) {
    this._totalCost = cost;
  }

  get totalCost() {
    return this._totalCost;
  }

  get exportTables() {
    if (this._exportTables instanceof Array) {
      return this._exportTables;
    }
    return [];
  }

  get exportPoints() {
    if (this._exportPoints instanceof Array) {
      return this._exportPoints;
    }
    return [];
  }

  _countTotalCost() {
    return this._exportPoints.reduce((a, b) => {
      return a + b.totalPrice;
    }, 0);
  }

  _makeTablesData(points) {
    const days = new Set(points.map((it) => {
      return it.date;
    }));
    const daysNumbers = {};
    [...days].sort((a, b) => {
      return moment(a, `MMM DD`) - moment(b, `MMM DD`);
    }).forEach((day, index) => {
      const count = index + 1;
      daysNumbers[day] = count;
    });
    const daysData = [...days].map((it) => {
      return {
        day: it,
        count: daysNumbers[it],
        points: points.filter((item) => {
          return item.date === it;
        })
      };
    });

    return daysData;
  }

  sortedPoints(points) {
    this.exportPoints = points;
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
    if (!this._online) {
      this._currentDestinationData.pictures = [];
    }
  }

  savePoint(newData) {
    newData.duration = this._addDuration(newData);
    newData.totalPrice = this._countPrice(newData);
    newData.date = moment(newData.timeRange.startTime).format(`MMM DD`);
    this.emit(`pointSaved`, newData);
    this._points.splice(this._points.indexOf(this._points.find((it) => {
      return it.id === newData.id;
    })), 1, newData);
    this.exportPoints = this._points;
  }

  createPoint(newData) {
    newData.duration = this._addDuration(newData);
    newData.totalPrice = this._countPrice(newData);
    newData.date = moment(newData.timeRange.startTime).format(`MMM DD`);
    this._points.push(newData);
    this.exportPoints = this._points;
  }

  _addDuration(point) {
    return moment.duration(moment(point.timeRange.endTime) - moment(point.timeRange.startTime));
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

export default Model;
