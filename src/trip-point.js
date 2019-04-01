import Component from './component';
import moment from 'moment';


const DRIVE_TYPE_MAP = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Flight`, `✈️`],
  [`Ship`, `🛳️`],
  [`Transport`, `🚊`],
  [`Drive`, `🚗`]
]);

class TripPoint extends Component {
  constructor(data, model) {
    super();
    this._model = model;
    this._id = data.id;
    this._date = data.date;
    this._type = data.type;
    this._city = data.city;
    this._price = data.price;
    this._description = data.description;
    this._timeRange = data.timeRange;
    this._duration = data.duration;
    this._offers = data.offers;
    this._pictures = data.pictures; // for what?

    this._onClickPoint = null;
    this._onClickListener = null;
  }

  _renderOffersList(offers = []) {
    return offers.map((item)=>{
      return `<li>
      <button class="trip-point__offer">${item.title} +&euro;&nbsp;${item.price}</button>
    </li>`;
    }).join(``);
  }

  set onClickPoint(fn) {
    this._onClickPoint = fn.bind(this);
  }

  get template() {
    return `<article class="trip-point"}>
    <i class="trip-icon">${this._type.icon}</i>
    <h3 class="trip-point__title">${this._type.type} ${DRIVE_TYPE_MAP.get(this._type.type) ? `to` : `in`} ${this._city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${moment(this._timeRange.startTime).format(`HH:mm`)}&nbsp;&mdash; ${moment(this._timeRange.endTime).format(`HH:mm`)}</span>
      <span class="trip-point__duration">${this._duration}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${this._price.count}</p>
      <ul class="trip-point__offers">
        ${this._renderOffersList(this._offers)}
      </ul>
  </article>`;
  }

  get date() {
    return this._date;
  }

  update(newData) {
    this._city = newData.city;
    this._type = newData.type;
    this._price = newData.price;
    this._timeRange = newData.timeRange;
    this._duration = newData.duration;
  }

  createListeners() {
    this._element.addEventListener(`click`, this._onClickPoint);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onClickPoint);
  }

}
export default TripPoint;
