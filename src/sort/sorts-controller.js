import SORTS_CONFIG from './sorts-config';
import Sort from './sort';
import {clearHTMLInside} from '../utils';

const SORTS_CONTAINER = document.querySelector(`.trip-sorting`);
class SortsController {
  constructor(model) {
    this._model = model;
    this._config = SORTS_CONFIG;
    this._container = SORTS_CONTAINER;

    model.on(`pointsLoaded`, () => {
      this.enable();
    });
  }

  init() {
    this._sorts = this._generateSortComponents();
    clearHTMLInside(`.trip-sorting`);
    this._sorts.forEach((it) => {
      this._container.appendChild(it);
    });
    this.disable();
  }

  _generateSortComponents() {
    const sorts = [];
    for (let sortData of this._config) {
      let sort = new Sort(sortData.sortName, sortData.checked ? true : false);
      sort.onSort = () => {
        this._model.doSort = SORTS_CONFIG.find((it) => {
          return it.sortName === sort.name;
        }).doSort;
      };
      sorts.push(sort.render());
    }
    return sorts;
  }

  enable() {
    this._sorts.forEach((element) => {
      element.firstElementChild.removeAttribute(`disabled`, `disabled`);
    });
  }

  disable() {
    this._sorts.forEach((element) => {
      element.firstElementChild.setAttribute(`disabled`, `disabled`);
    });
  }
}

export default SortsController;
