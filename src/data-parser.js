import moment from 'moment';

class DataParser {
  constructor(data) {
    this._id = data.id;
    this._type = data[`type`];
    this._timeRange.startTime = moment(data[`date_from`]).format(`HH:mm`);
    this._timeRange.endTime = moment(data[`date_to`]).format(`HH:mm`);

    this._description = data.destination.description;
    this._city = data.destination.name;
    this._picture = data.pictures;
    this._isFavorite = Boolean(data[`is_favorite`]);
    this._offers = data.offers; // ????
    this._date = moment(data[`date_from`]).format(`DD MMM`);
    this._price = data[`base_price`];

    // this._duration = data.duration;

  }

  toServerFormat() {

  }

  static parsePoint(data) {
    return new Parser(data);
  }

  static parsePoints(array) {
    return array.map((it) => {
      return Parser.parsePoint(it);
    });
  }
}

export {DataParser};
