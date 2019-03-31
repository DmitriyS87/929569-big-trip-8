import {EventEmitter} from "./event-emitter";

// import {EventEmitter} from 'events';

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
  }

  init(data) {
    this._model.points = data;
  }

  updatePoint(newData) {
    this._model.savePoint(newData);
  }

  deletePoint(id) {
    this._model.deletePoint(id);
  }
}

export {Controller};
