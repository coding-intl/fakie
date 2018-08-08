const faker = require('faker');

const flatten = (acc, obj) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      flatten(acc, obj[key]);
    }
    else {
      acc[key] = obj[key];
    }
  });
  return acc;
};
const flatFaker = flatten({}, faker);

const fakiefy = (handler, locale = 'en') => {
  faker.locale = locale;

  const deepCallEverything = (object) => {
    const result = Array.isArray(object) ? [] : {};
    for (let key in object) {
      if (typeof object[key] === 'string' && flatFaker[object[key]]) {
        result[key] = flatFaker[object[key]];
        console.log(key);
      }
      else {
        result[key] = object[key];
      }
    }
    return result;
  };

  if (typeof handler === 'object') {
    return deepCallEverything(handler);
  }
  return handler;
};

module.exports = {
  flatFaker,
  fakiefy
};