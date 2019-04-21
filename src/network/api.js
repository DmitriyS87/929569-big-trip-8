const keyPoints = `points`;
const keyDestinations = `destinations`;
const keyOffers = `offers`;


const checkStatus = (response) => {
  if (response.status >= 200 && response.status <= 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => {
  return response.json();
};

class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._getData(keyPoints);
  }

  getDestinations() {
    return this._getData(keyDestinations);
  }

  getOffers() {
    return this._getData(keyOffers);
  }

  _getData(name) {
    return this._load({url: name})
    .then(toJSON);
  }

  updatePoint({id, data}) {
    return this._load({url: `points/${id}`, method: `PUT`, body: JSON.stringify(data), headers: new Headers({'Content-Type': `application/json`})})
    .then(toJSON);
  }

  createPoint({data}) {
    return this._load({url: `points/`, method: `POST`, body: JSON.stringify(data), headers: new Headers({'Content-Type': `application/json`})})
    .then(toJSON);
  }

  deletePoint(id) {
    return this._load({url: `points/${id}`, method: `DELETE`});
  }

  syncData(storageDataPoints) {
    return this._load({url: `points/sync`, method: `POST`, body: JSON.stringify(storageDataPoints), headers: new Headers({'Content-Type': `application/json`})})
    .then(toJSON);
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(checkStatus)
    .catch((err) => {
      throw (err);
    });
  }


}

export default API;
