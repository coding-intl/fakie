
module.exports = class FakieClient {
  constructor(config) {
    this.config = config;
    this.host = config.host;
    this.routes = config.routes;
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

  static useRoute(route, request) {
    const handleValue = (value) => {
      switch (typeof value) {
        case 'object':
          return deepCallEverything(value);
        case 'function':
          return value();
        default:
          return value;
      }
    };
    const deepCallEverything = (object) => {
      const result = object.constructor === Array.constructor ? [] : {};
      for (let key in object) {
        result[key] = handleValue(object[key]);
      }
      return result;
    };

    if (typeof route.handler === 'object') {
      return deepCallEverything(route.handler);
    }
  }

  fetch(url, options) {
    const method = options && options.method ? options.method.toLowerCase() : 'GET';
    const path = url.startsWith(this.host) ? url.substr(this.host.length) : url;
    const pathName = path.replace(/[?#].*$/, '');
    const query = FakieClient.prettyQuery(path.replace(/^.*?\?([^#]*).*$/, '$1'));
    const hash = path.replace(/^.*#(.*)$/, '$1');

    for (let route of this.routes) {
      if (!route || !route.path || (route.methods && route.methods.indexOf(method) < 0)) return false;
      const regex = new RegExp('^'+route.path.replace(/:\w/, '([^/?#]*)')+'$');
      const match = path.match(regex);
      if (match) {
        let params = route.path.match(/:\w/g);
        if (params) {
          params = params.reduce((acc, key, index) => {
            acc[key] = match[index+1];
            return acc;
          }, {});
        }

        const request = {method, path, pathName, query, hash, params};
        if(typeof route.handler === 'function') {
          return route.handler(request);
        }
        else {
          return FakieClient.useRoute(route, request);
        }
      }
    }
  }
}