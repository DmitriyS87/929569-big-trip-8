const checkStatus = (response) => {
  if (response.status >= 200 && response.status <= 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => {
  return response.json();
};

class Loader {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
    .then(toJSON);
  }

  updatePoint() {

  }

  deletePoint() {

  }

  newPoint() {

  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(checkStatus)
    .catch((err) => {
      console.error(`error fetch: ${err}`);
      throw (err);
    });
  }


}

export {Loader};
