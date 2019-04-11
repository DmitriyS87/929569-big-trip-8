class EventEmitter {
  constructor() {
    this._events = {};
  }
  on(evt, listener) {
    (this._events[evt] || (this._events[evt] = [])).push(listener);
    return this;
  }
  emit(evt, arg) {
    (this._events[evt] || []).slice().forEach((lsn) => lsn(arg));
  }
  off(evt) {
    if (this._events[evt]) {
      delete this._events[evt];
    }
  }
  delete(evt, handler) {
    if (this._events[evt]) {
      this._events[evt].splice((this._events[evt].indexOf(handler)), 1);
      // delete this._events[evt];
    }
  }

}

export {EventEmitter};
