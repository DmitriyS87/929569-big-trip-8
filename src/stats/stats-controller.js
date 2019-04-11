import {EventEmitter} from "events";
import StatsModel from "./stats-model";

class StatsController extends EventEmitter {
  constructor(model) {
    super();
    this._model = model;
    this._onStatsClick = this._onStatsClick.bind(this);
  }

  init() {
    this._statsModel = new StatsModel(this._model);
    this.createListeners();
  }

  _onStatsClick(evt) {
    evt.preventDefault();
    const activeElement = document.querySelector(`.view-switch__item--active`);
    if (evt.target !== activeElement) {
      activeElement.classList.remove(`view-switch__item--active`);
      evt.target.classList.add(`view-switch__item--active`);
      const pointsContainer = document.querySelector(`.main`);
      const statsContainer = document.querySelector(`.statistic`);

      pointsContainer.classList.toggle(`visually-hidden`);
      statsContainer.classList.toggle(`visually-hidden`);

      if (!statsContainer.classList.contains(`visually-hidden`)) {
        this._statsModel.update();
      }
    }
  }

  createListeners() {
    Array.from(document.querySelectorAll(`.view-switch__item`)).forEach((switchLink) => {
      switchLink.addEventListener(`click`, this._onStatsClick);
    });
  }
  removeListeners() {
    Array.from(document.querySelectorAll(`.view-switch__item`)).forEach((switchLink) => {
      switchLink.removeEventListener(`click`, this._onStatsClick);
    });
  }
}

export default StatsController;
