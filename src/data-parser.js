import moment from 'moment';

class DataParser {
  constructor(data) {
    this._id = data.id;
    this._type = data[`type`];
    this._timeRange = {};
    this._timeRange.startTime = moment(data[`date_from`]);
    this._timeRange.endTime = moment(data[`date_to`]);

    this._description = data.destination.description;
    this._city = data.destination.name;
    this._picture = data.destination.pictures;
    this._isFavorite = Boolean(data[`is_favorite`]);
    this._offers = data.offers; // ????
    this._date = moment(data[`date_from`]).format(`DD MMM`);
    this._price = data[`base_price`];

    // this._duration = data.duration;

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
