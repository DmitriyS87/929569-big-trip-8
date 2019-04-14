import SORTS_CONFIG from 'sorts-config.js';
import Sort from './sort';
import {clearHTMLInside} from '../utils';

class SortsController {
  constructor(model, container) {
    this._model = model;
    this._config = SORTS_CONFIG;
    this._container = container;

    model.on(`pointsLoaded`, () => {
      this.enable();
    });
  }

  init() {
    this._sorts = this._generateSortComponents();
    clearHTMLInside(this._container);
    this._sorts.forEach((it) => {
      this._container.appendChild(it);
    });
    this.disable();
  }

  _generateSortComponents() {
    const STATS = [];
    for (let sortData of this._config) {
      let sort = new Sort(sortData.sortName);
      sort.onSort = () => {
        // this._model.exportPoints = this._model.points.filter((point) => {
        //   return this._config.find((it) => {
        //     return it.textFilter === filter.name;
        //   }).doFilter(point);
        // });
      };
      STATS.push(sort.render());
    }
    return STATS;
  }

  enable() {
    this._sorts.forEach((element) => {
      element.firstElementChild.setAttribute(`disabled`, `disabled`);
    });
  }

  disable() {
    this._sorts.forEach((element) => {
      element.firstElementChild.removeAttribute(`disabled`, `disabled`);
    });
  }
}

export default SortsController;
