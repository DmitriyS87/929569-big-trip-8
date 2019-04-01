import {EventEmitter} from "./event-emitter";
import {updateStats} from './statistics';

class Controller extends EventEmitter {
  constructor(model, view) {
    super();
    this._model = model;
    this._view = view;

    view.on(`onSave`, (newData) => {
      this.updatePoint(newData);
    });
    view.on(`onDelite`, (id) => {
      this.deletePoint(id);
    });
    view.on(`statsOn`, () => {
      updateStats(this._model.points);
    });
    view.on(`statsOff`, () => {
    });
  }

  init() {
    this._model.loadPoints();
  }

  updatePoint(newData) {
    this._model.savePoint(newData);
  }

  deletePoint(id) {
    this._model.deletePoint(id);
  }
}

export {Controller};
