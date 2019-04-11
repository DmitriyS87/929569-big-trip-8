class StatsController extends EventEmitter {
  constructor(model) {
    super();
    this._model = model;

    model.on(`pointsLoaded`, () => {
      this._enable();
    });
  }

  init() {
    this.createListeners();
    this._disable();
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
        this.emit(`statsOn`);
      } else {
        this.emit(`statsOff`);
      } // возможно имеет мсысл реализовать подключение и отключение статистики + удаление обработчиков
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

  _setDisabled(value) {
    Array.from(document.querySelectorAll(`.view-switch__item`)).forEach((element) => {
      element.disabled = value;
    });
  }

  _disable() {
    this._setDisabled(true);
  }

  _enable() {
    this._setDisabled(false);
  }
}

export default StatsController;
