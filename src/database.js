const fs = require('fs');

function getGeneralData() {
  return JSON.parse(fs.readFileSync('./data/general.json'));
}

function getFlights() {
  return JSON.parse(fs.readFileSync('./data/flights.json'));
}

module.exports = { getGeneralData, getFlights };