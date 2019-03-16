const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstChild;
};

class Trip {
  constructor() {
    if (new.target === Trip) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template!`);
  }

  bind() {
    this._element.addEventListener(`click`, this._onClickPoint);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onClickPoint);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
    return this._element;
  }
}

export default Trip;
