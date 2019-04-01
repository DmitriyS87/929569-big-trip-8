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

const STAY_TYPE_MAP = new Map([
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛`],
  [`Restaurant`, `🍴`]
]);
class DataParser {
  constructor(data) {
    this.id = String(data.id);

    this.type = {};
    data.type = data.type[0].toUpperCase() + data.type.substring(1);
    this.type.type = data.type;
    this.type.icon = DRIVE_TYPE_MAP.has(data.type) ? DRIVE_TYPE_MAP.get(data.type) : STAY_TYPE_MAP.get(data.type);

    this.timeRange = {};
    this.timeRange.startTime = moment(data[`date_from`]);
    this.timeRange.endTime = moment(data[`date_to`]);

    if (data.destination.description) {
      this.description = data.destination.description;
    }

    this.city = data.destination.name;
    this.pictures = {};
    this.pictures = data.destination.pictures;
    this.isFavorite = Boolean(data[`is_favorite`]);

    if (data.offers && data.offers.length !== 0) {
      this.offers = data.offers.map((it) => {
        return {title: String(it.title),
          price: Number(it.price),
          checked: Boolean(it.accepted)};
      });
    } else {
      this.offers = [];
    }

    this.date = moment(data[`date_from`]).format(`DD MMM`);
    this.price = {};
    this.basePrice = Number(data[`base_price`]);
  }

  toServerFormat() {

  }

  static parsePoint(data) {
    return new DataParser(data);
  }

  static parsePoints(array) {
    return array.map((it) => {
      return DataParser.parsePoint(it);
    });
  }
}

export {DataParser};
