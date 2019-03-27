import Component from './component';

class TripPoint extends Component {
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

    this._display = data.display;

    this._onClickPoint = null;
    this._onClickListener = null;
  }

  _renderOffersList(offers) {
    return offers.map((item)=>{
      return `<li>
      <button class="trip-point__offer">${item.title} +${item.currency}&nbsp;${item.price}</button>
    </li>`;
    }).join(``);
  }

  set onClickPoint(fn) {
    this._onClickPoint = fn.bind(this);
  }

  get template() {
    return `<article class="trip-point" ${this._display ? `` : `style="display:none"`}>
    <i class="trip-icon">${this._type.icon}</i>
    <h3 class="trip-point__title">${this._type.type} to ${this._city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${this._timeRange.startTime}&nbsp;&mdash; ${this._timeRange.endTime}</span>
      <span class="trip-point__duration">${this._duration}</span>
    </p>
    <p class="trip-point__price">${this._price.currency}&nbsp;${this._price.count}</p>
      <ul class="trip-point__offers">
        ${this._renderOffersList(this._offers)}
      </ul>
  </article>`;
  }

  set display(display) {
    this._display = display;
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
    if (this._display) {
      this._element.addEventListener(`click`, this._onClickPoint);
    }
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onClickPoint);
  }

}
export default TripPoint;
