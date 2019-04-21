import Component from '../component';
import moment from 'moment';

const OFFERS_LINES_CONFIG = {
  start: 0,
  end: 3
};


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
    this._timeRange = data.timeRange;
    this._duration = data.duration;
    this._offers = data.offers;
    this._totalPrice = data.totalPrice;

    this._onClickPoint = null;
    this._onClickListener = null;
  }

  get id() {
    return this._id;
  }

  set onClickPoint(fn) {
    this._onClickPoint = fn.bind(this);
  }

  get template() {

    const makeOffersList = (offers) => {
      return offers.map((item)=>{
        return `<li>${item.title} +&euro;&nbsp;${item.price}</li>`;
      }).slice(OFFERS_LINES_CONFIG.start, OFFERS_LINES_CONFIG.end).join(``);
    };

    const makeDuration = () => {
      const days = this._duration.get(`days`);
      const hours = this._duration.get(`hours`);
      const minutes = this._duration.get(`minutes`);

      return `${days > 0 ? `${days}D` : ``} ${days > 0 || hours > 0 ? `${hours}H` : ``} ${minutes > 0 ? `${minutes}M` : ``}`;
    };

    return `<article class="trip-point">
    <i class="trip-icon">${this._type.icon}</i>
    <h3 class="trip-point__title">${this._type.type} ${DRIVE_TYPE_MAP.get(this._type.type) ? `to` : `in`} ${this._city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${moment(this._timeRange.startTime).format(`HH:mm`)}&nbsp;&mdash; ${moment(this._timeRange.endTime).format(`HH:mm`)}</span>
      <span class="trip-point__duration">${makeDuration()}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${this._totalPrice}</p>
      <ul class="trip-point__offers">
        ${makeOffersList(this._offers)}
      </ul>
  </article>`;
  }

  get day() {
    return this._date;
  }

  update(newData) {
    this._date = newData.date;
    this._city = newData.city;
    this._type = newData.type;
    this._totalPrice = newData.totalPrice;
    this._timeRange = newData.timeRange;
    this._duration = newData.duration;
    this._offers = newData.offers;
  }

  createListeners() {
    this._element.addEventListener(`click`, this._onClickPoint);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onClickPoint);
  }

}
export default TripPoint;
