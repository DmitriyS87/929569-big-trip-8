import sortsConfig from './sorts-config';
import Sort from './sort';
import {clearHTMLInside} from '../utils';

const SORTS_CONTAINER = document.querySelector(`.trip-sorting`);
class SortsController {
  constructor(model) {
    this._model = model;
    this._config = sortsConfig;
    this._container = SORTS_CONTAINER;

    this._onPointsLoaded = () => {
      this.enable();
      model.off(`pointsLoaded`, this._onPointsLoaded);
    };

    model.on(`pointsLoaded`, this._onPointsLoaded);
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
    const sortsElements = [];
    for (let sortData of this._config) {
      let sort = new Sort(sortData.sortName, sortData.checked ? true : false);
      sort.onSort = () => {
        this._model.doSort = this._config.find((it) => {
          return it.sortName === sort.name;
        }).doSort;
      };
      sortsElements.push(sort.render());
    }
    return sortsElements;
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
