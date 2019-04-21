import Component from './component';

class TripDay extends Component {
  constructor(controller, date, id) {
    super();
    this._day = date;
    // this._points = data._points;
    this._id = id;
    this._controller = controller;
  }

  get id() {
    return this._id;
  }

  get day() {
    return this._day;
  }

  get pointsContainer() {
    return this.element.querySelector(`.trip-day__items`);
  }

  get template() {
    return `<section class="trip-day">
    <article class="trip-day__info">
      <span class="trip-day__caption">Day</span>
      <p class="trip-day__number">${this._id}</p>
      <h2 class="trip-day__title">${this._day}</h2>
    </article>

    <div class="trip-day__items">
    </div>
  </section>`;
  }
}
export default TripDay;
