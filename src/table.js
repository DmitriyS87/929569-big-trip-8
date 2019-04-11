import {EventEmitter} from "./event-emitter";
// import Filter from './filter';
import TripPoint from './points/trip-point';
import TripPointDetailed from './points/trip-point-detailed';

class Table extends EventEmitter {
  constructor(model, pointContainer) {
    super();
    this._model = model;
    this._pointsContainer = pointContainer;
    this._destinationsList = undefined;

    model.on(`pointsLoaded`, () => {
      model.off(`pointsLoaded`);
      return this.init();
    });
    model.on(`pointsChanged`, () => {
      return this._rerender();
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

  init() {
    this._generatePointsViews(this._model.exportPoints);
    this._renderPoints(this._arrayPoints);
  }

  _rerender() {
    this._arrayPoints.forEach((pair) => {
      pair.point.unrender();
      pair.pointDetailed.removeObjectListeners();
      pair.point = null;
      pair.pointDetailed = null;
    });
    this._arrayPoints = [];
    this._generatePointsViews(this._model.exportPoints);
    this._renderPoints(this._arrayPoints);
  }

  showStatus(text) {

    const message = document.createElement(`div`);
    message.innerHTML = `<p>${text}</p>`;
    this._pointsContainer.innerHTML = ``;
    this._pointsContainer.appendChild(message);
  }
  _deletePoint(id) {
    const deletedPair = this._arrayPoints.find((it) => {
      return it.point.id === id;
    });
    this._arrayPoints.splice(this._arrayPoints.indexOf(deletedPair), 1);
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
    // this.emit(`destinationsLoaded`, this.destinationsList);
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
      return it.point.id === newData.id;
    }).point.update(newData);
    this.emit(`updated`, newData.id);
  }

  _renderPoints(array) {
    // console.log(array);
    this._pointsContainer.innerHTML = ``;
    array.forEach((pair) => {
      this._pointsContainer.appendChild(pair.point.render());
    });
  }
  _generatePointsViews(data) {
    this._arrayPoints = data.map((pointData) => {
      if (pointData !== null) {
        const tripPoint = new TripPoint(pointData, this._model);
        const tripPointDetailed = new TripPointDetailed(pointData, this);
        tripPoint.onClickPoint = () => {
          tripPointDetailed.destinations = this._model.destinationsList;
          tripPointDetailed.render();
          this._pointsContainer.replaceChild(tripPointDetailed.element, tripPoint.element);
          tripPoint.unrender();
          this.emit(`editMode`);
        };
        tripPointDetailed.onClose = () => {
          tripPoint.render();
          this._pointsContainer.replaceChild(tripPoint.element, tripPointDetailed.element);
          tripPointDetailed.unrender();
          this.emit(`normalMode`);
        };
        tripPointDetailed.onSaveClick = (newData) => {
          this.emit(`onSave`, newData);
        };

        tripPointDetailed.onDelete = (id) => {
          this.emit(`onDelite`, id);
        };
        return {point: tripPoint,
          pointDetailed: tripPointDetailed
        };
      }
      return null;
    });
  }

  _clearPointsContainer() {
    this._pointsContainer.innerHTML = ``;
  }

}


export default Table;
