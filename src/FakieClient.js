const faker = require('./faker');

module.exports = class FakieClient {
  constructor(config) {
    this.host = config.host;
    this.routes = config.routes;
    this.seed = config.seed;
    this.locale = config.locale;
    if (this.locale) {
      faker.locale = this.locale;
    }
  }

  static prettyQuery(query) {
    query = query || '';
    return query
      .replace(/^\?/, '')
      .split('&')
      .reduce((acc, pair) => {
        if (pair) {
          const split = pair.split('=');
          acc[split[0]] = split[1] !== undefined ? split[1] : true;
        }
        return acc;
      }, {})
  };

  static createFake(config, request) {
    const handleValue = (value) => {
      switch (typeof value) {
        case 'object':
          return deepCallEverything(value);
        case 'function':
          return value(request);
        default:
          return value;
      }
    };
    const deepCallEverything = (object) => {
      if (Array.isArray(object)) {
        return object.map(handleValue);
      }
      else {
        const result = {};
        let keys = Object.keys(object);
        for (let key of keys) {
          result[key] = handleValue(object[key]);
        }
        return result;
      }
    };

    return handleValue(config);
  }

  fetch(url, options) {
    return new Promise((resolve, reject) => {
      const result = this.fetch(url, options);
      if (result === undefined) {
        let blob = new Blob(['{"ok": false, "status": 404, "statusText": "Not Found!"}'], {type: "application/json"});
        let init = { "status" : 404 , "statusText" : "Not Found!" };
        return resolve(new Response(blob, init))
      }
      else {
        let blob = new Blob([result], {type: "application/json"});
        let init = { "status" : 200 , "statusText" : "OK" };
        return resolve(new Response(blob, init))
      }
    });
  }

  fetchSync(url, options) {
    if (!url) return undefined;
    const method = options && options.method || 'GET';
    const path = url.indexOf(this.host) === 0 ? url.substr(this.host.length) : url;
    const pathName = path.replace(/[?#].*$/, '');
    const query = FakieClient.prettyQuery(path.replace(/^.*?\?([^#]*).*$/, '$1')) || {};
    const hash = path.replace(/^.*#(.*)$/, '$1');

    if (this.seed) {
      faker.seed(this.seed);
    }


    for (let route of this.routes) {
      if (!route || !route.path || (route.methods && route.methods.indexOf(method) < 0)) continue;

      const regex = new RegExp('^' + route.path.replace(/:\w+/, '([^/?#]*)') + '$');
      const match = path.match(regex);

      if (match) {
        let params = (route.path.match(/:\w+/g) || [])
          .reduce((acc, key, index) => {
            key = key.substr(1);
            acc[key] = match[index + 1];
            return acc;
          }, {});

        const request = { method, path, pathName, query, hash, params, body: options && options.body };

        if (typeof route.handler === 'function') {
          return route.handler(request);
        }
        else {
          return FakieClient.createFake(route.handler, request);
        }
      }
    }
  }
};