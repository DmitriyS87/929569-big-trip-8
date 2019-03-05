
const renderOfferItem = (offer) => {
  return `<li>
  <button class="trip-point__offer">${offer}</button>
</li>`;
};

const renderOffers = (offers) => {
  return offers.reduce((arr, item) => {
    return (arr !== 0 ? arr : ``) + renderOfferItem(item);
  }, 0);
};

export default ({icon = `🚕`, title = `Taxi to Airport`, timeTable = `10:00&nbsp;&mdash; 11:00`, duration = `1h 30m`, price = `&euro;&nbsp;20`, offers = `Order UBER +&euro;&nbsp;20`}) => {
  return `
  <article class="trip-point">
    <i class="trip-icon">${icon}</i>
    <h3 class="trip-point__title">${title}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${timeTable}</span>
      <span class="trip-point__duration">${duration}</span>
    </p>
    <p class="trip-point__price">${price}</p>
      <ul class="trip-point__offers">
        ${renderOffers(offers)}
      </ul>
  </article>`;
};
