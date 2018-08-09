const faker = require('./faker');
const FakieClient = require('./FakieClient');
const FakieServer = require('./FakieServer');
const {fakie, flatFaker} = require('./fakiefy');

module.exports = {
  FakieClient,
  FakieServer,
  faker,
  fakie,
  flatFaker,
};