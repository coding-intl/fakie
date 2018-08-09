const faker = require('./faker');
const FakieClient = require('./FakieClient');

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

const fakie = (config) => {
  const handleValue = (value) => {
    if (typeof value === 'string' && flatFaker[value]) {
      return (request) => flatFaker[value]();
    }
    else if (typeof value === 'object') {
      return deepCallEverything(value);
    }
    else {
      return value
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
};

fakie.array = (config, min = 5, max = 10) => {
  const fake = fakie(config);
  return (request) => {
    const size = faker.random.number({ min, max });
    const array = [];
    for (let i = 0; i < size; i++) {
      array[i] = FakieClient.createFake(fake, request);
    }
    return array;
  }
};

module.exports = {
  flatFaker,
  fakie,
};