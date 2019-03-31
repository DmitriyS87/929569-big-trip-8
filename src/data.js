import moment from 'moment';

const ARRAY_POINT_TYPES = [
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

const MAX_PRICE = 100;
const DEFAULT_CURRENCY = `&euro;`;

const makeRandomCount = (max) => {
  return Math.floor(Math.random() * max);
};
const CITIES = [`Moscow`, `Stambul`, `Berlin`, `New-York`, `Prague`, `Amsterdam`, `Minsk`, `Canberra`, `Kiev`, `Brasilia`, `Ottawa`, `Peking`, `Helsinki`, `Paris`];

const OFFERS = [{
  title: `Add luggage`,
  price: makeRandomCount(MAX_PRICE + 1),
  currency: DEFAULT_CURRENCY
}, {
  title: `Switch to comfort class`,
  price: makeRandomCount(MAX_PRICE + 1),
  currency: DEFAULT_CURRENCY
},
{
  title: `Add meal`,
  price: makeRandomCount(MAX_PRICE + 1),
  currency: DEFAULT_CURRENCY
},
{
  title: `Choose seats`,
  price: makeRandomCount(MAX_PRICE + 1),
  currency: DEFAULT_CURRENCY
}];

const TEXT_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomSentences = (text) => {
  let data = text.split(`.`);
  return data[makeRandomCount(data.length)];
};

const getRandomOffers = (arrayOffers) => {
  const count = makeRandomCount(3);
  const exportOffers = [];
  if (count > 0) {
    for (let i = 0; i < count; i++) {
      exportOffers.push(arrayOffers[makeRandomCount(arrayOffers.length)]);
    }
  }
  return exportOffers;
};

const getRandomTimeRange = () => {
  const timeStart = moment().add(makeRandomCount(13) - makeRandomCount(13), `h`).add(makeRandomCount(61), `m`);
  const timeFinish = moment(timeStart).startOf(`h`).add(makeRandomCount(24), `h`).add(makeRandomCount(61), `m`);
  const start = moment.min(timeStart, timeFinish);
  const end = moment.max(timeStart, timeFinish);
  return {
    startTime: start,
    endTime: end
  };
};

const getRandomDate = () => {
  return moment().add(makeRandomCount(7) - makeRandomCount(7), `d`).format(`DD MMM`);
};

let id = -1;

const setId = () => {
  id++;
  return id;
};

export default () => {
  return {
    id: setId(),
    date: getRandomDate(),
    type: ARRAY_POINT_TYPES[makeRandomCount(ARRAY_POINT_TYPES.length)],
    city: CITIES[makeRandomCount(CITIES.length)],
    description: getRandomSentences(TEXT_DESCRIPTION),
    timeRange: getRandomTimeRange(),
    price: {
      currency: DEFAULT_CURRENCY,
      count: makeRandomCount(51)
    },
    offers: getRandomOffers(OFFERS),
    picture: `http://picsum.photos/300/150?r=${Math.random()}`
  };
};
