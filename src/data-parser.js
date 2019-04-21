import moment from 'moment';

const FIRST_SYMBOL_INDEX = 0;

const TYPE_MAP = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Flight`, `✈️`],
  [`Ship`, `🛳️`],
  [`Transport`, `🚊`],
  [`Drive`, `🚗`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛`],
  [`Restaurant`, `🍴`]
]);
class DataParser {
  constructor(data) {
    this.id = String(data.id);

    this.type = {};
    data.type = data.type[FIRST_SYMBOL_INDEX].toUpperCase() + data.type.substring(FIRST_SYMBOL_INDEX + 1);
    this.type.type = data.type;
    this.type.icon = TYPE_MAP.get(data.type);

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
    this.price = {};
    this.price.count = Number(data[`base_price`]);
  }

  static toServerFormat(data) {
    return {
      [`id`]: String(data.id),
      [`type`]: String(data.type.type),
      [`date_from`]: moment(data.timeRange.startTime),
      [`date_to`]: moment(data.timeRange.endTime),
      [`destination`]: {
        [`description`]: data.description,
        [`name`]: data.city,
        [`pictures`]: data.pictures
      },
      [`is_favorite`]: data.isFavorite,
      [`offers`]: data.offers.length > 0 ? data.offers.map((it) => {
        return {
          [`title`]: it.title,
          [`price`]: it.price,
          [`accepted`]: it.checked,
        };
      }) : [],
      [`base_price`]: data.price.count
    };
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

export default DataParser;
