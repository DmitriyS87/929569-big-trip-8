import {EventEmitter} from "./event-emitter";
import {updateStats} from './statistics';
import {Loader} from './loader';
import {DataParser} from './data-parser';

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

const sessionKey = getKey();

class Controller extends EventEmitter {
  constructor(model, view) {
    super();
    this._model = model;
    this._view = view;

    view.on(`onSave`, (newData) => {
      this.updatePoint(newData);
    });
    view.on(`onDelite`, (id) => {
      this.deletePoint(id);
    });
    view.on(`statsOn`, () => {
      updateStats(this._model.points);
    });
    view.on(`statsOff`, () => {
    });
  }

  init() {
    this._view.showStatus(`Loading route...`);
    this._loadPoints();
    this._loadDestinations();
    this._loadOffers();

  }

  _loadPoints() {
    const getPoints = new Loader(ENTRY, sessionKey);
    getPoints.getData(`points`)
    .then((data) => {
      return DataParser.parsePoints(data);
    })
    .then((array) => {
      this._model.points = array;
    })
    .catch(() => {
      this._view.showStatus(`Something went wrong while loading your route info. Check your connection or try again later`);
    });
  }

  _loadDestinations() {
    const getDestinations = new Loader(ENTRY, sessionKey);
    getDestinations.getData(`destinations`)
    .then((array) => {
      this._model.allDestinations = array;
    });
  }

  _loadOffers() {
    const offers = new Loader(ENTRY, getKey());
    offers.getData(`offers`)
    .then((array) => {
      this._model.offers = array.map((it) => {
        it.type = it.type[0].toUpperCase() + it.type.substring(1);
        return it;
      });
      this._model.baseOffersTypes = array;
    });
  }

  updatePoint(newData) {
    const point = new Loader(ENTRY, sessionKey);
    point.updatePoint({id: newData.id, data: DataParser.toServerFormat(newData)})
    .catch((it) => {
      this._view.enablePoint(newData.id);
      throw new Error(it);
    })
.then((data) => {
  if (data) {
    this._model.savePoint(DataParser.parsePoint(data));
  }
});
  }

  deletePoint(id) {
    const point = new Loader(ENTRY, sessionKey);
    point.deletePoint(id)
    .catch((it) => {
      this._view.enablePoint(id);
      throw new Error(it);
    })
.then(() => {
  this._model.deletePoint(id);
});
  }
}

export {Controller};
