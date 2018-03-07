'use strict';

const gardenResponse = require('../responses/garden');

module.exports = (app) => {
  const { garden } = app;

  if (!garden.plants.length) {
    gardenResponse.showHasNoPlants(app);
  } else {
    gardenResponse.show(app);
  }
};
