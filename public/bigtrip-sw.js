const CACHE_NAME = `BIG_TRIP`;
const IGNORE_URL_PATTERN = /point|photo/;

self.addEventListener(`install`, (evt) => {
  function onInstall() {
    return caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./css/normalize.css`,
        `./css/main.css`,
        `./bundle.js`,
        `./bundle.js.map`,
        `./img/star--check.svg`,
        `./img/star.svg`
      ]);
    });
  }
  evt.waitUntil(onInstall(evt));
});

self.addEventListener(`activate`, (evt) => {
  console.log(`sw`, `activate`, {evt});
});

const getNewData = (request) => {
  console.log(`now we check our window isOnline`);
  if (navigator.onLine) {
    console.log(`now we make fetch and save it in our cache`, {request});
    return updateCache(request);
  }
  return Promise.reject(new Error(`cant save new request in offline mode`))
  .catch(console.log);
};


function fromCache(evt) {
  return caches.match(evt.request).then((matching) => {
    if (!matching) {
      throw Error(`\${event.request.url} not found in cache`);
    }
    return matching;
  });
}

function updateCache(cacheKey, request, response) {
  if (response.ok) {
    caches.open(cacheKey)
    .then((cache) => {
      cache.put(request, response.clone());
    });
    return response.clone();
  }
  return response.clone();
}

self.addEventListener(`fetch`, (evt) => {
  console.log(`fetch`, {request: evt.request});
  // if (evt.request.method === `GET`) {
  //   console.log(`cathced!`);
  function onFetchFilter(evtParam) {
    const request = evtParam.request;
    const url = request.url;
    const criteria = {
      isGET: request.method === `GET`,
      notMatchesPathPattern: !IGNORE_URL_PATTERN.test(url)
    };

    const failingCriterias = Object.keys(criteria).filter((it) => {
      return !criteria[it];
    });

    return !(failingCriterias.length > 0);
  }

  function onFetch(evtParam) {
    const request = evtParam.request;
    const acceptHeader = request.headers.get(`Accept`);
    let resourceType = CACHE_NAME;

    if (acceptHeader.indexOf(`text/html`) !== -1) {
      resourceType = CACHE_NAME + `content`;
    } else if (acceptHeader.indexOf(`image`) !== -1) {
      resourceType = CACHE_NAME + `image`;
    }

    const cacheKey = resourceType;

    if (resourceType === `content`) {
      evtParam.respondWith(
          fetch(request)
          .then((response) => {
            return updateCache(cacheKey, request, response);
          })
          .catch(() => fromCache(evtParam))
          // .catch(() => offlineResponse(opts))
      );
    } else {
      evtParam.respondWith(
          fromCache(evtParam)
          .catch(() => fetch(request))
          .then((response) => updateCache(cacheKey, request, response))
          // .catch(() => offlineResponse(resourceType, opts))
      );
    }
  }


  if (onFetchFilter(evt)) {
    onFetch(evt);
  }


});

