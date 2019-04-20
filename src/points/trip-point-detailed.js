import Component from '../component';
import moment from 'moment';
import flatpickr from 'flatpickr';

const ESC = 27;
const DRIVE_TYPE_MAP = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Flight`, `✈️`],
  [`Ship`, `🛳️`],
  [`Transport`, `🚊`],
  [`Drive`, `🚗`]
]);

const STAY_TYPE_MAP = new Map([
  [`Taxi`, `🚕`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛`],
  [`Restaurant`, `🍴`]
]);

const _replaceDash = (text) => {
  return text.replace(/\b-/ig, ` `);
};
class TripPointDetailed extends Component {
  constructor(data, pointsTable) {
    super();
    this._pointsTable = pointsTable;

    this._id = data.id;
    this._date = data.date;
    this._type = data.type;
    this._city = data.city;
    this._price = data.price;
    this._totalPrice = data.totalPrice;
    this._timeRange = data.timeRange;
    this._duration = data.duration;
    this._offers = data.offers;

    this._isFavorite = data.isFavorite;

    this._onSelectTravelWay = this._onSelectTravelWay.bind(this);
    this._onClickTravelWay = this._onClickTravelWay.bind(this);
    this._includeDestinations = this._includeDestinations.bind(this);
    this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
    this._onDeliteButtonClick = this._onDeliteButtonClick.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onChangeTimeStart = this._onChangeTimeStart.bind(this);
    this._onDeleteClick = null;

    this._onUpdateHandler = (id) => {
      if (id === this._id) {
        this._onClose();
      }
    };
    pointsTable.on(`updated`, this._onUpdateHandler);

    this._onErrorHandler = (id) => {
      if (id === this._id) {
        this._enable();
        this.element.querySelector(`.point__button:first-child`).innerText = `Save`;
        this.element.querySelector(`.point__button:last-child`).innerText = `Delete`;
        this._errorView();
      }
    };
    pointsTable.on(`unblockError`, this._onErrorHandler);

    this._onDeleteHandler = (id) => {
      if (id === this._id) {
        this._delete();
        pointsTable.emit(`normalMode`);
        pointsTable.emit(`pointDeletedFromPage`);
      }
    };
    pointsTable.on(`deleted`, this._onDeleteHandler);
    this._onDeleteNewHandler = (id) => {
      if (id === this._id) {
        this._delete();
        pointsTable.emit(`normalMode`);
        // pointsTable.emit(`pointDeletedFromPage`);
      }
    };
    pointsTable.on(`onDeleteNew`, this._onDeleteNewHandler);
  }

  get id() {
    return this._id;
  }

  _replaceSpace(text) {
    return text.replace(/\b\s/ig, `-`);
  }

  _onSaveButtonClick(evt) {
    evt.preventDefault();
    if (this._stateError) {
      this._resetErrorView();
    }
    const formData = new FormData(this._element.childNodes[1]);
    const newData = this._processForm(formData);
    newData.id = this._id;
    newData.date = moment(newData.timeRange.startTime).format(`MMM DD`);
    this.update(newData);
    this.element.querySelector(`.point__button:first-child`).innerText = `Saving...`;
    this._disable();
    if (typeof this._onSaveClick === `function`) {
      this._onSaveClick(newData);
    }
  }

  _onChangeTimeStart(evt) {
    this._element.querySelector(`.point__input`).value = moment(evt.target.value).format(`MMM DD`);
  }

  _disable() {
    Array.from(this.element.getElementsByTagName(`input`)).forEach((it) => {
      it.disabled = true;
    });
    Array.from(this.element.getElementsByTagName(`button`)).forEach((it) => {
      it.disabled = true;
    });
  }

  _enable() {
    Array.from(this.element.getElementsByTagName(`input`)).forEach((it) => {
      it.disabled = false;
    });
    Array.from(this.element.getElementsByTagName(`button`)).forEach((it) => {
      it.disabled = false;
    });
  }

  _errorView() {
    this._stateError = true;
    this.element.classList.add(`shake`);
    this.element.style.border = `1px solid red`;
  }

  _resetErrorView() {
    this.element.classList.remove(`shake`);
    this.element.style.border = ``;
    this._stateError = false;
  }

  _onDeliteButtonClick(evt) {
    evt.preventDefault();

    if (this._stateError) {
      this._resetErrorView();
    }
    this.element.querySelector(`.point__button:last-child`).innerText = `Deliting...`;
    this._disable();
    this._onDeleteClick(this._id);
  }

  _processForm(formData) {
    const clipboard = {
      type: {
        type: ``,
        icon: ``
      },
      city: ``,
      timeRange: {
        startTime: ``,
        endTime: ``
      },
      price: {
        count: 0
      },
      totalPrice: 0,
      offers: [],
      isFavorite: false
    };

    const translator = TripPointDetailed.createMaper(clipboard);
    for (let pair of formData.entries()) {
      let [key, value] = pair;
      if (translator.has(key)) {
        translator.get(key)(value);
      }
    }

    clipboard.offers = this._offers.map((it) => {
      const sameOffer = clipboard.offers.find((offer) => {
        return offer.title === it.title;
      });
      if (sameOffer) {
        it.checked = true;
      } else {
        it.checked = false;
      }
      return it;
    });

    clipboard.description = this._description;
    clipboard.pictures = this._pictures;
    return clipboard;
  }

  set destinations(list) {
    if (list !== undefined) {
      this._destinationNames = this._includeDestinations(list);
    }
  }

  _includeDestinations(list) {
    const destinations = list.map((it) => {
      return `<option value="${it}"></option>`;
    }).join(``);
    return destinations;
  }

  _onSelectTravelWay() {
    this._element.querySelector(`.travel-way__toggle`).checked = false;
  }

  _onChangeDestination(evt) {
    if (this._setDestinationData(evt.target.value)) {
      this._partialUpdate(this._element.querySelector(`.point__destination`), this._getDestinationTemplate(this._description, this._pictures));
    }
  }

  _setDestinationData(destination) {
    this._pointsTable._currentDestinationName = destination;
    const destinationData = this._pointsTable._destinationData;
    if (destinationData) {
      this._description = destinationData.description;
      this._pictures = destinationData.pictures;
      return true;
    }
    return false;
  }

  _getDestinationTemplate() {
    return `<h3 class="point__details-title">Destination</h3>
    <p class="point__destination-text">${this._description}</p>
    <div class="point__destination-images">
      ${this._pictures.map((picture) => {
    return `<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`;
  })}
    </div>`;
  }

  static createMaper(target) {
    return new Map([
      [`travel-way`, (value) => {
        target.type.type = value;
        target.type.icon = DRIVE_TYPE_MAP.has(value) ? DRIVE_TYPE_MAP.get(value) : STAY_TYPE_MAP.get(value);
        return target.type;
      }],
      [`destination`, (value) => {
        target.city = value;
        return target.city;
      }],
      [`date-start`, (value) => {
        target.timeRange.startTime = value;
        return target.timeRange;
      }],
      [`date-end`, (value) => {
        target.timeRange.endTime = value;
        return target.timeRange;
      }],
      [`price`, (value) => {
        target.price.count = Number(value);
        return target.price;
      }],
      [`total-price`, (value) => {
        target.totalPrice = Number(value);
        return target.totalPrice;
      }],
      [`offer`, (value) => {
        target.offers.push({
          title: _replaceDash(value)
        });
        return target.offers;
      }],
      [`favorite`, () => {
        target.isFavorite = true;
        return target.isFavorite;
      }]
    ]);
  }

  _onClickTravelWay(evt) {
    if (evt.target.name === `travel-way`) {
      this._type.type = evt.target.value;
      this._type.icon = DRIVE_TYPE_MAP.has(this._type.type) ? DRIVE_TYPE_MAP.get(this._type.type) : STAY_TYPE_MAP.get(this._type.type);
      this._element.querySelector(`.travel-way__label`).innerText = this._type.icon;
      this._element.querySelector(`.point__destination-label`).innerText = `${evt.target.value} ${STAY_TYPE_MAP.has(evt.target.value) ? ` in` : ` to`}`;
      this._updateOffers(evt.target.value);
      this._partialUpdate(this._element.querySelector(`.point__offers-wrap`), this._getOffersTemplate(this._offers));
    }
  }

  _updateOffers(type) {
    this._pointsTable.currentType = type;
    this._offers = this._pointsTable.currentOffers;
  }

  _getOffersTemplate(offers) {
    return offers.map((offer) => {
      return `<input class="point__offers-input visually-hidden" type="checkbox" id="${this._replaceSpace(offer.title)}" name="offer" value="${this._replaceSpace(offer.title)}" ${offer.checked ? `checked` : ``}>
                <label for="${this._replaceSpace(offer.title)}" class="point__offers-label">
                  <span class="point__offer-service">${offer.title}</span> + &euro;<span class="point__offer-price">${offer.price}</span>
                </label>`;
    }).join(``);
  }

  set onSaveClick(fn) {
    this._onSaveClick = fn;
  }

  set onClose(fn) {
    this._onClose = fn.bind(this);
  }

  set onDelete(fn) {
    this._onDeleteClick = fn.bind(this);
  }

  _onKeyDown(evt) {
    if (evt.keyCode === ESC) {
      this._onClose();
    }
  }

  get template() {
    const renderGroupTravelWay = (map) => {
      return `<div class="travel-way__select-group">
      ${Array.from(map.keys()).map((key)=>{
    return `<input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${key}" name="travel-way" value="${key}" ${key.toLowerCase() === this._type.type.toLowerCase() ? `checked` : ``}>
        <label class="travel-way__select-label" for="travel-way-${key}">${map.get(key)} ${key}</label>
        `;
  }).join(` `)}
    </div>`;
    };
    this._setDestinationData(this._city);
    return `<article class="point">
    <form action="" method="get">
      <header class="point__header">
        <label class="point__date">
          choose day
          <input class="point__input" type="text" placeholder="MAR 18" name="day" value="${this._date}" disabled="disabled">
        </label>

        <div class="travel-way">
          <label class="travel-way__label" for="travel-way__toggle">${this._type.icon}</label>

          <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

          <div class="travel-way__select">
          ${renderGroupTravelWay(DRIVE_TYPE_MAP)}
          ${renderGroupTravelWay(STAY_TYPE_MAP)}
          </div>
        </div>

        <div class="point__destination-wrap">
          <label class="point__destination-label" for="destination">${this._type.type} to</label>
          <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
          <datalist id="destination-select">
          ${this._destinationNames ? this._destinationNames : ``}
          </datalist>
        </div>

        <label class="point__time">
          choose time
          <input class="point__input" type="text" value="" name="date-start" placeholder="19:00">
          <input class="point__input" type="text" value="" name="date-end" placeholder="21:00">
        </label>

        <label class="point__price">
          write price
          <span class="point__price-currency">&euro;</span>
          <input class="point__input" type="number" style="-webkit-appearance: none; margin: 0; -moz-appearance:textfield;" value="${this._price.count}" name="price">
        </label>

        <div class="point__buttons">
          <button class="point__button point__button--save" type="submit">Save</button>
          <button class="point__button" type="reset">Delete</button>
        </div>

        <div class="paint__favorite-wrap">
          <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label class="point__favorite" for="favorite">favorite</label>
        </div>
      </header>

      <section class="point__details">
        <section class="point__offers">
          <h3 class="point__details-title">offers</h3>

          <div class="point__offers-wrap">
          ${this._getOffersTemplate(this._offers)}
          </div>

        </section>
        <section class="point__destination">
          ${this._getDestinationTemplate()}
        </section>
        <input type="hidden" class="point__total-price" name="total-price" value="${this._totalPrice}">
      </section>
    </form>
  </article>`;
  }

  _delete() {
    this.removeObjectListeners();
    this.element.remove();
    this.unrender();
  }

  _partialUpdate(element, html) {
    element.innerHTML = html;
  }

  update(newData) {
    this._date = newData.date;
    this._id = newData.id;
    this._city = newData.city;
    this._type = newData.type;
    this._price = newData.price;
    this._totalPrice = newData.totalPrice;
    this.timeRange = newData.timeRange;
    this._duration = newData.duration;
    this._offers = newData.offers;
    this._isFavorite = newData.isFavorite;
  }

  createListeners() {
    this._element.querySelector(`.point__time .point__input`).addEventListener(`change`, this._onChangeTimeStart);
    this._element.querySelector(`.point__buttons .point__button:first-child`).addEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__buttons .point__button:last-child`).addEventListener(`click`, this._onDeliteButtonClick);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onClickTravelWay);
    document.addEventListener(`keydown`, this._onKeyDown);
    Array.from(this._element.querySelectorAll(`.travel-way__select-group`)).forEach((it) => {
      it.addEventListener(`click`, this._onSelectTravelWay);
    });
    flatpickr(this._element.querySelector(`.point__time .point__input:first-child`), {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      defaultDate: moment(this._timeRange.startTime).format(`YYYY MM DD HH:mm`)
    });
    flatpickr(this._element.querySelector(`.point__time .point__input:last-child`), {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      defaultDate: moment(this._timeRange.endTime).format(`YYYY MM DD HH:mm`)
    });
  }

  removeObjectListeners() {
    this._pointsTable.delete(`updated`, this._onUpdateHandler);
    this._pointsTable.delete(`unblockError`, this._onErrorHandler);
    this._pointsTable.delete(`deleted`, this._onDeleteHandler);
  }

  removeListeners() {
    this._element.querySelector(`.point__time .point__input`).removeEventListener(`change`, this._onChangeTimeStart);
    this._element.querySelector(`.point__buttons .point__button:first-child`).removeEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__buttons .point__button:last-child`).removeEventListener(`click`, this.onDeliteButtonClick);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`click`, this._onClickTravelWay);
    document.removeEventListener(`keydown`, this._onKeyDown);
    Array.from(this._element.querySelectorAll(`.travel-way__select-group`)).forEach((it) => {
      it.removeEventListener(`click`, this._onSelectTravelWay);
    });
  }
}
export default TripPointDetailed;
