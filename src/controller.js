import {EventEmitter} from "./event-emitter";
import API from './network/api';
import DataParser from './data-parser';
import StatsController from "./stats/stats-controller";
import FiltersController from "./filters/filters-controller";
import Store from "./network/store";
import Provider from "./network/provider";

const ENTRY = `https://es8-demo-srv.appspot.com/big-trip`;
const VAILD_SYMBOLS = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
const STORAGE_KEY = `big_trip_storage`;

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
  constructor(model, pointsTable) {
    super();
    this._model = model;
    this._pointsTable = pointsTable;
    this._api = new API(ENTRY, sessionKey);
    this._store = new Store(STORAGE_KEY, window.localStorage);
    this._provider = new Provider(this._api, this._store);

    pointsTable.on(`onSave`, (newData) => {
      this.updatePoint(newData);
    });
    pointsTable.on(`onDelite`, (id) => {
      this.deletePoint(id);
    });
    pointsTable.on(`editMode`, () => {
      this.setEditMode();
    });
    pointsTable.on(`normalMode`, () => {
      this.setNormalMode();
    });
  }

  init() {
    this._pointsTable.showStatus(`Loading route...`);
    this._loadPoints();
    this._loadDestinations();
    this._loadOffers();
    this._initStats();
    this._initFilters();
    this._syncDataInit();
  }

  setEditMode() {
    this._statsController.removeListeners();
    this._filtersController.disable();
  }

  setNormalMode() {
    this._statsController.createListeners();
    this._filtersController.enable();
  }

  _initFilters() {
    this._filtersController = new FiltersController(this._model);
    this._filtersController.init();
  }
  _initStats() {
    this._statsController = new StatsController(this._model);
    this._statsController.init();
  }

  _syncDataInit() {
    window.addEventListener(`offline`, () => {
      document.title = `${document.title}[OFFLINE]`;
      this._model.online = false;
    });
    window.addEventListener(`online`, () => {
      document.title = document.title.split(`[OFFLINE]`)[0];
      this._model.online = true;
      this._provider.syncData();
    });
  }

  _removeStats() {
    this._statsController.removeCharts();
    this._statsController = null;
  }

  _loadPoints() {
    this._provider.getPoints()
    .then((points) => {
      this._model.points = points;
    })
    .catch(() => {
      this._pointsTable.showStatus(`Something went wrong while loading your route info. Check your connection or try again later`);
    });
  }

  _loadDestinations() {
    this._api.getDestinations()
    .then((destinations) => {
      this._model.allDestinations = destinations;
    });
  }

  _loadOffers() {
    this._api.getOffers()
    .then((offers) => {
      this._model.offers = offers.map((it) => {
        it.type = it.type[0].toUpperCase() + it.type.substring(1);
        return it;
      });
      this._model.baseOffersTypes = offers;
    });
  }

  updatePoint(newData) {
    this._provider.updatePoint({id: newData.id, data: DataParser.toServerFormat(newData)})
    .catch((it) => {
      this._pointsTable.enablePoint(newData.id);
      throw new Error(it);
    })
.then((point) => {
  if (point) {
    this._model.savePoint(point);
  }
});
  }

  deletePoint(id) {
    this._provider.deletePoint(id)
    .catch((it) => {
      this._pointsTable.enablePoint(id);
      throw new Error(it);
    })
.then(() => {
  this._model.deletePoint(id);
});
  }


}

export default Controller;
