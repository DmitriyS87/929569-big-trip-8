const renderOfferItem = (offer) => {
  return `<li>
  <button class="trip-point__offer">${offer}</button>
</li>`;
};

const renderOffersList = (offers) => {
  return offers.map(renderOfferItem).join(``);
};

const title = (data) => {
  return `${data.type.type} to ${data.city}`;
};

export default (data) => {
  console.log(data);
  return `<article class="trip-point">
    <i class="trip-icon">${data.type.icon}</i>
    <h3 class="trip-point__title">${title(data)}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${data.timeTable}</span>
      <span class="trip-point__duration">${data.duration}</span>
    </p>
    <p class="trip-point__price">${data.price}</p>
      <ul class="trip-point__offers">
        ${renderOffersList(data.offers)}
      </ul>
  </article>`;
};
