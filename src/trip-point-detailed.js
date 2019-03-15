const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstChild;
};
class TripPointDetailed {
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
    this._onSaveClick = undefined;
    this._onResetClick = undefined;
  }

  _renderOffersList(offers) {
    return offers.map((item)=>{
      return `<li>
      <button class="trip-point__offer">${item.title} +${item.currency};&nbsp;${item.price}</button>
    </li>`;
    }).join(``);
  }

  _replaceSpace(text) {
    return text.replace(/\b\s/ig, `-`);
  }

  set onClickDetiledPoint(fn) {
    this._onClickPoint = fn.bind(this);
  }

  set onSaveClick(fn) {
    this._onSaveClick = fn;
  }

  set onResetClick(fn) {
    this._onResetClick = fn;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `<article class="point">
    <form action="" method="get">
      <header class="point__header">
        <label class="point__date">
          choose day
          <input class="point__input" type="text" placeholder="MAR 18" name="day">
        </label>

        <div class="travel-way">
          <label class="travel-way__label" for="travel-way__toggle">${this._type.icon}</label>

          <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

          <div class="travel-way__select">
            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
              <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
              <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
              <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train" checked>
              <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
            </div>

            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
              <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
              <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
            </div>
          </div>
        </div>

        <div class="point__destination-wrap">
          <label class="point__destination-label" for="destination">${this._type.type} to</label>
          <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
          <datalist id="destination-select">
            <option value="airport"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="hotel"></option>
          </datalist>
        </div>

        <label class="point__time">
          choose time
          <input class="point__input" type="text" value="${this._timeTable.startTime}&nbsp;&mdash; ${this._timeTable.endTime}" name="time" placeholder="00:00 — 00:00">
        </label>

        <label class="point__price">
          write price
          <span class="point__price-currency">${this._price.currency}</span>
          <input class="point__input" type="text" value="${this._price.count}" name="price">
        </label>

        <div class="point__buttons">
          <button class="point__button point__button--save" type="submit">Save</button>
          <button class="point__button" type="reset">Delete</button>
        </div>

        <div class="paint__favorite-wrap">
          <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
          <label class="point__favorite" for="favorite">favorite</label>
        </div>
      </header>

      <section class="point__details">
        <section class="point__offers">
          <h3 class="point__details-title">offers</h3>

          <div class="point__offers-wrap">
            ${this._offers.map((offer) => {
    return `<input class="point__offers-input visually-hidden" type="checkbox" id="${this._replaceSpace(offer.title)}" name="offer" value="${this._replaceSpace(offer.title)}">
              <label for="${this._replaceSpace(offer.title)}" class="point__offers-label">
                <span class="point__offer-service">${offer.title}</span> + ${offer.currency}<span class="point__offer-price">${offer.price}</span>
              </label>`;
  })}
          </div>

        </section>
        <section class="point__destination">
          <h3 class="point__details-title">Destination</h3>
          <p class="point__destination-text">${this._description}</p>
          <div class="point__destination-images">
            <img src="${this._picture}" alt="picture from place" class="point__destination-image">
          </div>
        </section>
        <input type="hidden" class="point__total-price" name="total-price" value="">
      </section>
    </form>
  </article>`;
  }

  _makeEventListener(elementClass, onClickHandler) {
    this._element.querySelector(elementClass).addEventListener(`click`, onClickHandler);
  }

  _removeEventListener(elementClass, onClickHandler) {
    this._element.querySelector(elementClass).removeEventListener(`click`, onClickHandler);
  }

  bindSave() {
    this._makeEventListener(`.point__buttons .point__button:first-child`, this._onSaveClick);
  }

  unbindSave() {
    this._removeEventListener(`.point__buttons .point__button:first-child`, this._onSaveClick);
  }

  bindReset() {
    this._makeEventListener(`.point__buttons .point__button:last-child`, this._onResetClick);
  }

  unbindReset() {
    this._removeEventListener(`.point__buttons .point__button:last-child`, this._onResetClick);
  }

  render() {
    this._element = createElement(this.template);
    this.bindSave();
    this.bindReset();
    return this._element;
  }

  unrender() {
    this.unbindSave();
    this.unbindReset();
    this._element = null;
    return this._element;
  }

}
export default TripPointDetailed;
