const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstChild;
};
class TripPointClass {
  constructor(data) {
    this.type = data.type;
    this.city = data.city;
    this.price = data.price;
    this.description = data.description;
    this.timeTable = data.timeTable;
    this.duration = data.duration;
    this.offers = data.offers;
    this.picture = data.picture;

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


  get template() {
    return `<article class="trip-point">
    <i class="trip-icon">${this.type}</i>
    <h3 class="trip-point__title">${this.type.type} to ${this.city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${this.timeTable}</span>
      <span class="trip-point__duration">${this.duration}</span>
    </p>
    <p class="trip-point__price">${this.price}</p>
      <ul class="trip-point__offers">
        ${this._renderOffersList(this.offers)}
      </ul>
  </article>`;
  }

  render() {
    this._element = createElement(this.template);

  }


}
export const TripPoint = new TripPointClass();
