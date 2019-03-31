import {EventEmitter} from "./event-emitter";
import TripPoint from './trip-point';
import TripPointDetailed from './trip-point-detailed';

class View extends EventEmitter {
  constructor(model, container) {
    super();
    this._model = model;
    this._container = container;
    model.on(`pointsLoaded`, () => {
      return this.show();
    });
    model.on(`pointSaved`, (newData) => {
      return this._updatePoint(newData);
    });
    model.on(`pointDeleted`, (id) => {
      return this._deletePoint(id);
    });
  }

  show() {
    this._generateViews(this._model.points);
    this._renderPoints(this._arrayPoints);
  }
  _deletePoint(id) {
    this.emit(`deleted`, id);
  }

  _updatePoint(newData) {
    this._arrayPoints.find((it) => {
      return it._id === newData.id;
    }).update(newData);
    this.emit(`updated`, newData.id);
  }

  _renderPoints(array) {
    array.forEach((point) => {
      this._container.appendChild(point.render());
    });
  }
  _generateViews(data) {
    this._arrayPoints = data.map((pointData) => {
      if (pointData !== null) {
        const tripPoint = new TripPoint(pointData, this._model);
        const tripPointDetailed = new TripPointDetailed(pointData, this._model, this);
        tripPoint.onClickPoint = () => {
          tripPointDetailed.render();
          this._container.replaceChild(tripPointDetailed.element, tripPoint.element);
          tripPoint.unrender();
        };
        tripPointDetailed.onClose = () => {
          tripPoint.render();
          this._container.replaceChild(tripPoint.element, tripPointDetailed.element);
          tripPointDetailed.unrender();
        };
        tripPointDetailed.onSaveClick = (newData) => {
          this.emit(`onSave`, newData);
          // this.disable();
        };

        tripPointDetailed.onDelete = (id) => {
          this.emit(`onDelite`, id);
        };
        return tripPoint;
      }
      return null;
    });
  }
}


export {View};
