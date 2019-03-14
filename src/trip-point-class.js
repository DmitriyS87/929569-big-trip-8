const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstChild;
};
class TripPointClass {
  constructor(data) {
    this._type = data.type;
    this._city = data.city;
    this._price = data.price;
    this._description = data.description;
    this._timeTable = data.timeTable;
    this._duration = data.duration;
    this._offers = data.offers;
    this._picture = data.picture;

    this._element = null;
  }

  _renderOfferItem(offer) {
    return `<li>
    <button class="trip-point__offer">${offer}</button>
  </li>`;
  }

  _renderOffersList(offers) {
    return offers.map(this._renderOfferItem).join(``);
  }

  set onClickPoint(fn) {
    this._onClickPoint = fn;
  }

  get template() {
    return `<article class="trip-point">
    <i class="trip-icon">${this._type.icon}</i>
    <h3 class="trip-point__title">${this._type.type} to ${this._city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${this._timeTable}</span>
      <span class="trip-point__duration">${this._duration}</span>
    </p>
    <p class="trip-point__price">${this._price}</p>
      <ul class="trip-point__offers">
        ${this._renderOffersList(this._offers)}
      </ul>
  </article>`;
  }

  bind() {
    this._element.querySelector().addEventListener().bind(this);

  }

  unbind() {
    this._element.querySelector().removeEventListener().bind(this);
  }

  render() {
    this._element = createElement(this.template);
    return this._element;
  }


}
export const TripPoint = TripPointClass;
