import Component from './component';

import flatpickr from 'flatpickr';

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
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛`],
  [`Restaurant`, `🍴`]
]);

const _replaceDash = (text) => {
  return text.replace(/\b-/ig, ` `);
};

const _getMatchString = (text, pattern) => {
  if (text !== null) {
    const arrayText = text.match(pattern);
    return arrayText[0].trim();
  }
  return `00:00`;
};
class TripPointDetailed extends Component {
  constructor(data) {
    super();
    this._date = data.date;
    this._type = data.type;
    this._city = data.city;
    this._price = data.price;
    this._description = data.description;
    this._timeRange = data.timeRange;
    this._duration = data.duration;
    this._offers = data.offers;
    this._picture = data.picture;

    this._onClickTravelWay = this._onClickTravelWay.bind(this);

    this._onClickTimeInput = this._onClickTimeInput.bind(this);

    this._onSaveButtonClick = this._onSaveButtonClick.bind(this);

    this._onDeleteClick = null;
  }

  _replaceSpace(text) {
    return text.replace(/\b\s/ig, `-`);
  }

  _onSaveButtonClick(evt) {
    evt.preventDefault();
    if (this._element.querySelector(`.point__price .point__input`).checkValidity()) {
      const formData = new FormData(this._element.childNodes[1]);
      const newData = this._processForm(formData);
      if (typeof this._onSaveClick === `function`) {
        this._onSaveClick(newData);
      }

      this.update(newData);
    }

  }


  _processForm(formData) {
    const clipboard = {
      type: {
        type: ``,
        icon: ``
      },
      city: ``,
      timeRange: {
        startTime: `00:00`,
        endTime: `00:00`
      },
      price: {
        currency: `&euro;`,
        count: ``
      },
      offers: [],
    };

    const translator = TripPointDetailed.createMaper(clipboard);
    for (let pair of formData.entries()) {
      let [key, value] = pair;
      if (translator.has(key)) {
        translator.get(key)(value);
      }
    }
    return clipboard;
  }

  _partialUpdate() {

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
      [`time`, (value) => {
        target.timeRange.startTime = _getMatchString(value, /\d\d\:\d\d\s/ig);
        target.timeRange.endTime = _getMatchString(value, /\s\d\d\:\d\d/ig);
        return target.timeRange;
      }],
      [`price`, (value) => {
        target.price.count = value;
        return target.price;
      }],
      [`offer`, (value) => {
        target.offers.push({
          title: value,
          price: `${Array.from(document.querySelectorAll(`.point__offers-label`)).find((item) => {
            return item.children[0].innerText === _replaceDash(value);
          }).children[1].innerText}`,
          currency: `&euro;`
        });
        return target.offers;
      }]
    ]);
  }

  _onClickTravelWay(evt) {
    if (evt.target.name === `travel-way`) {
      this._type.type = evt.target.value;
      this._type.icon = DRIVE_TYPE_MAP.has(this._type.type) ? DRIVE_TYPE_MAP.get(this._type.type) : STAY_TYPE_MAP.get(this._type.type);
      this._element.querySelector(`.travel-way__label`).innerText = this._type.icon;
      this._element.querySelector(`.point__destination-label`).innerText = `${evt.target.value} ${STAY_TYPE_MAP.has(evt.target.value) ? ` in` : ` to`}`;
    }
  }

  _onClickTimeInput(evt) {
    const newTime = flatpickr(this._element.querySelector(`.point__time .point__input`), {
      enableTime: true,
      dateFormat: `H:i`,
      mode: `range`,
      clickOpens: false,
      locale: {
        rangeSeparator: ` — `
      },
      defaultDate: [_getMatchString(evt.target.value, /\d\d\:\d\d\s/ig), _getMatchString(evt.target.value, /\s\d\d\:\d\d/ig)]

    });
    newTime.open();
  }

  set onSaveClick(fn) {
    this._onSaveClick = fn;
  }

  set onDelete(fn) {
    this._onDeleteClick = fn.bind(this);
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
          ${renderGroupTravelWay(DRIVE_TYPE_MAP)}
          ${renderGroupTravelWay(STAY_TYPE_MAP)}
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
          <input class="point__input" type="text" value="${this._timeRange.startTime}&nbsp;&mdash; ${this._timeRange.endTime}" name="time" placeholder="00:00 — 00:00">
        </label>

        <label class="point__price">
          write price
          <span class="point__price-currency">${this._price.currency}</span>
          <input class="point__input" type="number" style="-webkit-appearance: none; margin: 0; -moz-appearance:textfield;" value="${this._price.count}" name="price">
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

  update(newData) {
    this._city = newData.city;
    this._type = newData.type;
    this._price = newData.price;
    this.timeRange = newData.timeRange;
    this._duration = newData.duration;
  }

  createListeners() {
    this._element.querySelector(`.point__buttons .point__button:first-child`).addEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__buttons .point__button:last-child`).addEventListener(`click`, this._onDeleteClick);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onClickTravelWay);
    this._element.querySelector(`.point__time .point__input`).addEventListener(`click`, this._onClickTimeInput);
  }

  removeListeners() {
    this._element.querySelector(`.point__buttons .point__button:first-child`).removeEventListener(`click`, this._onSaveClick);
    this._element.querySelector(`.point__buttons .point__button:last-child`).removeEventListener(`click`, this._onDeleteClick);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`click`, this._onClickTravelWay);
    this._element.querySelector(`.point__time .point__input`).removeEventListener(`click`, this._onClickTimeInput);
  }

}
export default TripPointDetailed;
