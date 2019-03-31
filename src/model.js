class Model {
  set points(array) {
    this._points = array;
  }
  get points() {
    if (this._points instanceof Array) {
      return this._points;
    }
    return [];
  }

  deletePoint() {
  }

  set destinations(array) {
    this._destinations = array;
  }

  get destinationsNames() {
    return this._destinations.map((it) => {
      return it.name;
    });
  }


  set currentDestination(name) {
    this._currentDestination = name;
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
  }

  set currentType(type) {
    this._currentType = type;
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
