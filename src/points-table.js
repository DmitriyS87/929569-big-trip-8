import {EventEmitter} from "./event-emitter";
// import Filter from './filter';
import TripPoint from './points/trip-point';
import TripPointDetailed from './points/trip-point-detailed';
import TripDay from './trip-day';
import moment from 'moment';

class PointsTable extends EventEmitter {
  constructor(model, pointContainer) {
    super();
    this._model = model;
    this._pointsContainer = pointContainer;
    this._destinationsList = undefined;
    this._isRendered = false; // костыль!!!!
    this._openedNewPoint = null;

    model.on(`pointsChanged`, () => {
      return this._rerender();
    });
    model.on(`pointSaved`, (newData) => {
      return this._updatePoint(newData);// this._rerender(); // лишнее?? см "pointsChanged"
    });
    model.on(`newPointSaved`, (id) => {
      return this.emit(`newPointSaved`, id); // лишнее?? см "pointsChanged"
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
    this._getData();
    this._tables = this._makeTables();
    this._clearContainer();
    this._tables.forEach((it) => {
      it.render();
      this.renderElement(it.element);
    });
    this._arrayPoints = this._makePoints();
    this._isRendered = true;
  }

  makeNewPoint() {
    console.log(`makeNewPoint run!`);

    const container = this._pointsContainer;
    const newData = this._model.getNewPointData();
    const newPoint = new TripPointDetailed(newData, this);
    newPoint.onClose = () => {
      container.removeChild(newPoint.element);
      newPoint.removeObjectListeners();
      newPoint.unrender();
      newPoint = null;
      this.emit(`normalMode`);
    };
    newPoint.onSaveClick = (data) => {
      this.emit(`onSaveNewPoint`, data);
    };
    newPoint.onDelete = (id) => {
      this.emit(`onDeleteNew`, id);
    };

    newPoint.render();
    container.insertBefore(newPoint.element, container.firstChild);
    this._openedNewPoint = newPoint;
  }

  closeNewPoint() {
    // this._pointsContainer.removeChild(this._openedNewPoint.element);
    // this._openedNewPoint.unrender();
    // this._openedNewPoint = null;
    this._openedNewPoint._delete();
    this.emit(`normalMode`);
  }

  _getData() {
    this._daysData = this._model.exportTables;
    this._pointsData = this._model.exportPoints;
  }

  _renderTable() {
    return this._tablePoints.map((it) => {
      const template = it.points.map((point) => {
        point.point.render();
        return point.point.element;
      });
      template.forEach((item) => {
        it.dayContainer.querySelector(`.trip-day__items`).appendChild(item);
      });
      return it.dayContainer;
    });
  }

  _makePoints() {
    return this._pointsData.map((pointData) => {
      return this._generatePointView(pointData, this._tables.find((table) => {
        return pointData.date === table.day;
      }).pointsContainer);
    });
  }

  _deletePoints() {
    this._arrayPoints.forEach((pair) => {
      pair.point.unrender();
      pair.pointDetailed.removeObjectListeners();
      pair.point = null;
      pair.pointDetailed = null;
    });
    this._arrayPoints = [];
  }

  _rerender() {
    console.log(`rerender`);
    if (this._isRendered) {
      this._deletePoints();
    }
    this.init();
  }

  showStatus(text) {
    const message = document.createElement(`div`);
    message.innerHTML = `<p>${text}</p>`;
    this._pointsContainer.innerHTML = ``;
    this._pointsContainer.appendChild(message);
  }
  _deletePoint(id) {
    // данные должны получить из модели!!!
    const deletedPair = this._arrayPoints.find((it) => {
      return it.point.id === id;
    });
    this._arrayPoints.splice(this._arrayPoints.indexOf(deletedPair), 1);
    // this._rerender();
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

  _clearContainer() {
    this._pointsContainer.innerHTML = ``;
  }

  renderElement(it) {
    this._pointsContainer.appendChild(it);
  }

  _makeTables() {
    const data = this._daysData;

    return data.map((dayData) => {
      const tripDay = new TripDay(this, dayData, dayData.count);
      return tripDay;
    });
  }

  _generatePointView(pointData, dayContainer) {
    const makePointPair = (data, pointsDayContainer) => {
      const tripPoint = new TripPoint(data, this._model);
      const tripPointDetailed = new TripPointDetailed(data, this);
      tripPoint.onClickPoint = () => {
        tripPointDetailed.destinations = this._model.destinationsList;
        tripPointDetailed.render();
        pointsDayContainer.replaceChild(tripPointDetailed.element, tripPoint.element);
        tripPoint.unrender();
        this.emit(`editMode`);
      };
      tripPointDetailed.onClose = () => {
        tripPoint.render();
        pointsDayContainer.replaceChild(tripPoint.element, tripPointDetailed.element);
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
    };
    const pointPair = makePointPair(pointData, dayContainer);
    const renderPoint = (point, container) => {
      point.render();
      container.appendChild(point.element);
    };

    renderPoint(pointPair.point, dayContainer);

    return pointPair;
  }

  _clearPointsContainer() {
    this._pointsContainer.innerHTML = ``;
  }

}

export default PointsTable;
