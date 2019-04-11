import {EventEmitter} from "./event-emitter";
import API from './api';
import DataParser from './data-parser';
import StatsController from "./stats/stats-controller";
import FiltersController from "./filters/filters-controller";


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
  }

  init() {
    this._view.showStatus(`Loading route...`);
    this._loadPoints();
    this._loadDestinations();
    this._loadOffers();
    this._initStats();
    this._initFilters();
  }

  _initFilters() {
    const filtersController = new FiltersController(this._model);
    filtersController.init();
  }
  _initStats() {
    this._statsController = new StatsController(this._model);
    this._statsController.init();
  }

  _removeStats() {
    this._statsController.removeCharts();
    this._statsController = null;
  }

  _loadPoints() {
    const api = new API(ENTRY, sessionKey);
    api.getData(`points`)
    .then((points) => {
      return DataParser.parsePoints(points);
    })
    .then((points) => {
      this._model.points = points;
    })
    .catch((err) => {
      console.log(err);
      this._view.showStatus(`Something went wrong while loading your route info. Check your connection or try again later`);
    });
  }

  _loadDestinations() {
    const api = new API(ENTRY, sessionKey);
    api.getData(`destinations`)
    .then((destinations) => {
      this._model.allDestinations = destinations;
    });
  }

  _loadOffers() {
    const api = new API(ENTRY, getKey());
    api.getData(`offers`)
    .then((offers) => {
      this._model.offers = offers.map((it) => {
        it.type = it.type[0].toUpperCase() + it.type.substring(1);
        return it;
      });
      this._model.baseOffersTypes = offers;
    });
  }

  updatePoint(newData) {
    const api = new API(ENTRY, sessionKey);
    api.updatePoint({id: newData.id, data: DataParser.toServerFormat(newData)})
    .catch((it) => {
      this._view.enablePoint(newData.id);
      throw new Error(it);
    })
.then((point) => {
  if (point) {
    this._model.savePoint(DataParser.parsePoint(point));
  }
});
  }

  deletePoint(id) {
    const api = new API(ENTRY, sessionKey);
    api.deletePoint(id)
    .catch((it) => {
      this._view.enablePoint(id);
      throw new Error(it);
    })
.then(() => {
  this._model.deletePoint(id);
});
  }


}

export default Controller;
