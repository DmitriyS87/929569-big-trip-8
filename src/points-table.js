import {EventEmitter} from "./event-emitter";
import TripPoint from './points/trip-point';
import TripPointDetailed from './points/trip-point-detailed';
import TripDay from './trip-day';

class PointsTable extends EventEmitter {
  constructor(model, pointContainer) {
    super();
    this._model = model;
    this._pointsContainer = pointContainer;
    this._destinationsList = undefined;
    this._isRendered = false;
    this._openedNewPoint = null;


    model.on(`pointsChanged`, () => {
      return this._rerender();
    });
    model.on(`pointSaved`, (newData) => {
      return this._updatePoint(newData);
    });
    model.on(`newPointSaved`, (id) => {
      return this.emit(`newPointSaved`, id);
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
    this._tablesElements = [];
    this._getData();
    this._tables = this._makeTables();
    this._clearContainer();
    this._arrayPoints = this._makePoints();
    this._isRendered = true;
    this._tablesElements.forEach((it) => {
      this._pointsContainer.appendChild(it);
    });
  }

  makeNewPoint() {
    const container = this._pointsContainer;
    const newData = this._model.getNewPointData();
    const newPoint = new TripPointDetailed(newData, this);
    newPoint.onClose = () => {
      container.removeChild(newPoint.element);
      newPoint.removeObjectListeners();
      newPoint.unrender();
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
    this._openedNewPoint.delete();
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
      let suitableTable = this._tables.find((it) => {
        return it.day === pointData.date;
      });
      if (suitableTable.element === null) {
        suitableTable.render();
        this._tablesElements.push(suitableTable.element);
      }
      return this._generatePointView(pointData, suitableTable.element.querySelector(`.trip-day__items`));
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
      const tripDay = new TripDay(this, dayData.day, dayData.count);
      return tripDay;
    });
  }
  _getTableElement(pointDate) {
    const table = this._tables.find((it) => {
      return it.day === pointDate.date;
    });

    return table.element;
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

}

export default PointsTable;
