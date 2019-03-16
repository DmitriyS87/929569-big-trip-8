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

  _renderOffersList(offers) {
    return offers.map((item)=>{
      return `<li>
      <button class="trip-point__offer">${item.title} +${item.currency};&nbsp;${item.price}</button>
    </li>`;
    }).join(``);
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template!`);
  }

  createListeners() {
    this._element.addEventListener(`click`, this._onClickPoint);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onClickPoint);
  }

  render() {
    this._element = createElement(this.template);
    this.createListeners();
    return this._element;
  }

  unrender() {
    this.removeListeners();
    this._element = null;
    return this._element;
  }
}

export default Trip;
