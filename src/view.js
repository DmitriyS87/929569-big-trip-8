import {EventEmitter} from "./event-emitter";
import Filter from './filter';
import TripPoint from './trip-point';
import TripPointDetailed from './trip-point-detailed';

import moment from 'moment';

const FILTERS_DATA = [{
  textFilter: `Everything`,
  doFilter() {
    return true;
  }
},
{
  textFilter: `Future`,
  doFilter(point) {
    if (moment().isBefore(moment(point.date, `DD MMM`))) {
      return true;
    }
    return false;
  }
},
{
  textFilter: `Past`,
  doFilter(point) {
    if (moment(point.date, `DD MMM`).isBefore(moment())) {
      return true;
    }
    return false;
  }
}];
class View extends EventEmitter {
  constructor(model, pointContainer, filterContainer) {
    super();
    this._model = model;
    this._pointsContainer = pointContainer;
    this._filterContainer = filterContainer;
    this._destinationsList = undefined;

    model.on(`pointsLoaded`, () => {
      model.off(`pointsLoaded`);
      return this.show();
    });
    model.on(`pointSaved`, (newData) => {
      return this._updatePoint(newData);
    });
    model.on(`pointDeleted`, (id) => {
      return this._deletePoint(id);
    });
    model.on(`DestinationsLoaded`, () => {
      model.off(`DestinationsLoaded`);
      return this._saveDestinationsList();
    });
    model.on(`offersLoaded`, () => {
      model.off(`offersLoaded`);
      return this._saveBaseOffersTypes();
    });
  }

  show() {
    this._generateViews(this._model.points);
    this._renderPoints(this._arrayPoints);
    this._addFilters();
    this._addStats();
  }

  showStatus(text) {

    const message = document.createElement(`div`);
    message.innerHTML = `<p>${text}</p>`;
    this._pointsContainer.innerHTML = ``;
    this._pointsContainer.appendChild(message);
  }
  _deletePoint(id) {
    const deletedElement = this._arrayPoints.find((it) => {
      return it.id === id;
    });
    this._arrayPoints.splice(this._arrayPoints.indexOf(deletedElement), 1);
    this.emit(`deleted`, id);
  }

  set _currentDestinationName(name) {
    this._model._destinationData = name;
  }

  set currentType(type) {
    this._model.currentType = type;
  }

  get currentOffers() {
    return this._model.currentTypeOffers;
  }

  get _destinationData() {
    return this._model._destinationData;
  }

  _saveBaseOffersTypes() {
    this.baseOffersTypesList = this._model.baseOffersTypes;
  }

  _saveDestinationsList() {
    this.destinationsList = this._model.destinationsList;
  }

  set destinationsList(list) {
    this._destinationsList = list;
  }

  get destinationsList() {
    return this._destinationsList;
  }

  enablePoint(id) {
    this.emit(`unblockError`, id);
  }

  _updatePoint(newData) {
    this._arrayPoints.find((it) => {
      return it._id === newData.id;
    }).update(newData);
    this.emit(`updated`, newData.id);
  }

  _renderPoints(array) {
    this._pointsContainer.innerHTML = ``;
    array.forEach((point) => {
      this._pointsContainer.appendChild(point.render());
    });
  }
  _generateViews(data) {
    this._arrayPoints = data.map((pointData) => {
      if (pointData !== null) {
        const tripPoint = new TripPoint(pointData, this._model);
        const tripPointDetailed = new TripPointDetailed(pointData, this._model, this);
        tripPoint.onClickPoint = () => {
          tripPointDetailed.destinations = this.destinationsList;
          tripPointDetailed.render();
          this._pointsContainer.replaceChild(tripPointDetailed.element, tripPoint.element);
          tripPoint.unrender();
        };
        tripPointDetailed.onClose = () => {
          tripPoint.render();
          this._pointsContainer.replaceChild(tripPoint.element, tripPointDetailed.element);
          tripPointDetailed.unrender();
        };
        tripPointDetailed.onSaveClick = (newData) => {
          this.emit(`onSave`, newData);
        };

        tripPointDetailed.onDelete = (id) => {
          this.emit(`onDelite`, id);
        };
        return tripPoint;
      }
      return null;
    });
  }

  _clearPointsContainer() {
    this._pointsContainer.innerHTML = ``;
  }

  _addFilters() {
    for (let filterData of FILTERS_DATA) {
      let filter = new Filter(filterData);
      filter.onFilter = () => {
        this._clearPointsContainer();
        this._arrayPoints.filter((point) => {
          return point !== null;
        }).forEach((point) => {
          if (point.element !== null) {
            point.unrender();
          }
        });
        this._renderPoints(this._arrayPoints.filter((point) => {
          return point !== null;
        }).filter((point) => {
          return FILTERS_DATA.find((it) => {
            return it === filterData;
          }).doFilter(point);
        }));
      };
      this._filterContainer.appendChild(filter.render());
    }
  }

  _addStats() {
    const onStatsClick = (evt) => {
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
        }
      }
    };

    Array.from(document.querySelectorAll(`.view-switch__item`)).forEach((switchLink) => {
      switchLink.addEventListener(`click`, onStatsClick);
    });
  }

}


export default View;
