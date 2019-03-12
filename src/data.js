const TYPES = [
  {type: `Taxi`,
    icon: `🚕`},
  {type: `Bus`,
    icon: `🚌`},
  {type: `Train`,
    icon: `🚂`},
  {type: `Ship`,
    icon: `🛳️`},
  {type: `Transport`,
    icon: `🚊`},
  {type: `Drive`,
    icon: `🚗`},
  {type: `Flight`,
    icon: `✈️`},
  {type: `Check-in`,
    icon: `🏨`},
  {type: `Sightseeing`,
    icon: `🏛️`},
  {type: `Restaurant`,
    icon: `🍴`}
];

const DEFAULT_CURRENCY = `&euro`;

const CITIES = [`Moscow`, `Stambul`, `Berlin`, `New-York`, `Prague`, `Amsterdam`, `Minsk`, `Canberra`, `Kiev`, `Brasilia`, `Ottawa`, `Peking`, `Helsinki`, `Paris`];

const OFFERS = [{
  title: `Add luggage`,
  get price() {
    return Math.round(Math.random() * 100);
  },
  currency: DEFAULT_CURRENCY
}, {
  title: `Switch to comfort class`,
  get price() {
    return Math.round(Math.random() * 100);
  },
  currency: DEFAULT_CURRENCY
},
{
  title: `Add meal`,
  get price() {
    return Math.round(Math.random() * 100);
  },
  currency: DEFAULT_CURRENCY
},
{
  title: `Choose seats`,
  get price() {
    return Math.round(Math.random() * 100);
  },
  currency: DEFAULT_CURRENCY
}];

const TEXT_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomSentences = (text) => {
  return text.split(`.`)[Math.round(Math.random() * 3)];
};

const getRandomOffers = (array) => {
  return array.map((item)=>{
    return `${item.title} +${item.currency};&nbsp;${item.price}`;
  })[Math.round(Math.random() * 2)];
};

const timeOptions = {
  hour: `numeric`,
  minute: `numeric`
};

const getRandomTimeTable = () => {
  const date = new Date();
  const start = new Intl.DateTimeFormat(`en-US`, timeOptions).format(date.hour - Math.random(12 * Math.random()));
  const end = new Intl.DateTimeFormat(`en-US`, timeOptions).format(date.hour + Math.random(12 * Math.random()));
  return `${start}&nbsp;&mdash; ${end}`;
};

export default () => {
  return {type: TYPES[Math.round(Math.random() * TYPES.length)],
    city: CITIES[Math.round(Math.random() * CITIES.length)],
    description: getRandomSentences(TEXT_DESCRIPTION),
    timeTable: getRandomTimeTable(),
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: getRandomOffers(OFFERS),
    picture: `http://picsum.photos/300/150?r=${Math.random()}`
  };
};
