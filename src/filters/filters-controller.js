import filtersConfig from './filters-config';
import Filter from './filter';
import {EventEmitter} from '../event-emitter';
import {clearHTMLInside} from '../utils';

const FILTER_FORM_CLASS = `.trip-filter`;
const filterContainer = document.querySelector(FILTER_FORM_CLASS);

class FiltersController extends EventEmitter {
  constructor(model, mainController) {
    super();
    this._model = model;
    this._mainController = mainController;
    this._config = filtersConfig;
    this._filterFunction = null;

    this._onPointsLoaded = () => {
      this.enable();
      model.off(`pointsLoaded`, this._onPointsLoaded);
    };

    model.on(`pointsLoaded`, this._onPointsLoaded);
  }

  init() {
    this._filters = this._generateFilters();
    clearHTMLInside(FILTER_FORM_CLASS);
    this._filters.forEach((it) => {
      filterContainer.appendChild(it);
    });
    this.disable();
  }

  disable() {
    this._filters.forEach((element) => {
      element.firstElementChild.setAttribute(`disabled`, `disabled`);
    });
  }

  enable() {
    this._filters.forEach((element) => {
      element.firstElementChild.removeAttribute(`disabled`, `disabled`);
    });
  }

  set filterFunction(fn) {
    this._filterFunction = fn;
  }

  get filterFunction() {
    return this._filterFunction;
  }

  get filters() {
    return this._filters;
  }

  _generateFilters() {
    const filtersElements = [];
    for (let filterData of this._config) {
      let filter = new Filter(filterData.textFilter, filterData.checked ? true : false);
      filter.onFilter = () => {
        this._model.doFilter = this._config.find((it) => {
          return it.textFilter === filter.name;
        }).doFilter;

      };
      filtersElements.push(filter.render());
    }
    return filtersElements;
  }
}

export default FiltersController;
