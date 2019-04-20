import DataParser from "../data-parser";

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
      .then((points) => {
        points.map((point) => {
          this._store.setItem({key: point.id, item: point});
        });
        return points;
      })
      .then((points) => {
        return DataParser.parsePoints(points);
      });
    }
    const storePointsMap = this._store.getAll();
    const storePoints = objectToArray(storePointsMap);
    const points = DataParser.parsePoints(storePoints);

    return Promise.resolve(points);
  }

  updatePoint({id, data}) {
    if (this._isOnline()) {
      return this._api.updatePoint({id, data})
      .then((point) => {
        this._store.setItem({key: point.id, item: point});
        return DataParser.parsePoint(point);
      });
      // .then(toJSON);
    }
    const point = data;
    this._needSync = true;
    this._store.setItem({key: point.id, item: point});
    return Promise.resolve(DataParser.parsePoint(point));
  }

  createPoint({id, data}) {
    if (this._isOnline()) {
      return this._api.createPoint({id, data})
      .then((point) => {
        this._store.setItem({key: point.id, item: point});
        return DataParser.parsePoint(point);
      });
      // .then(toJSON);
    }
    const point = data;
    this._needSync = true;
    this._store.setItem({key: point.id, item: point});
    return Promise.resolve(DataParser.parsePoint(point));
  }

  deletePoint(id) {
    if (this._isOnline()) {
      return this._api.deletePoint(id)
      .then(() => {
        this._store.removeItem({key: id});
      });
    }
    this._needSync = true;
    this._store.removeItem({key: id});
    return Promise.resolve(true);
    //
  }

  syncData() {
    if (this._needSync) {
      return this._api.syncData(objectToArray(this._store.getAll()))
      .then(() => {
        this._needSync = false;
      });
    }
    return true;
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
