import DataParser from "./data-parser";

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    // this._endPoint = endPoint;
    // this._authorization = authorization;
    this._needSync = false;
  }

  getPoints() {
    if (this._isOnline) {
      return this._api.getPoints(name)
      .then((points) => {
        points.map((point) => {
          this._store.setItem({key: point.id, item: point});
        });
      })
      .then((points) => {
        DataParser.parsePoints(points);
      });
    }
    const storePointsMap = this._store.getAll();
    const storePoints = objectToArray(storePointsMap);
    const points = DataParser.parsePoints(storePoints);

    return Promise.resolve(points);
  }

  updatePoint({id, data}) {
    if (this._isOnline) {
      return this._api.updatePoint({id, data})
      .then((point) => {
        this._store.setItem({key: point.id, item: point});
      })
      .then((point) => {
        Promise.resolve(point);
      });
      // .then(toJSON);
    }
    const point = data;
    this._needSync = true;
    this._store.setItem({key: point.id, item: point});
    return Promise.resolve(DataParser.parsePoints(point));
  }

  deletePoint(id) {
    if (this._isOnline) {
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
    return this._api.syncData({points: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
