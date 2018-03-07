'use strict';

const gardenResponse = require('../responses/garden');

module.exports = (app) => {
  gardenResponse.restartFallback(app);
};
