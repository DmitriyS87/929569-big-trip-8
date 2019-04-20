import FILTERS_DATA from './filters-config';
import Filter from './filter';
import {EventEmitter} from '../event-emitter';
import {clearHTMLInside} from '../utils';

const FILTER_FORM_CLASS = `.trip-filter`;
const filterContainer = document.querySelector(FILTER_FORM_CLASS);

class FiltersController extends EventEmitter {
  constructor(model) {
    super();
    this._model = model;
    this._config = FILTERS_DATA;

    model.on(`pointsLoaded`, () => {
      this.enable();
    });
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

  get filters() {
    return this._filters;
  }

  _generateFilters() {
    const FILTERS = [];
    for (let filterData of this._config) {
      let filter = new Filter(filterData.textFilter, filterData.checked ? true : false);
      filter.onFilter = () => {
        this._model.exportPoints = this._model.points.filter((point) => {
          return this._config.find((it) => {
            return it.textFilter === filter.name;
          }).doFilter(point);
        });
      };
      FILTERS.push(filter.render());
    }
    return FILTERS;
  }
}

export default FiltersController;
