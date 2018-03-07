'use strict';

const gardenResponse = require('../responses/garden');

module.exports = (app) => {
  gardenResponse.changePaletteFallback(app);
};
