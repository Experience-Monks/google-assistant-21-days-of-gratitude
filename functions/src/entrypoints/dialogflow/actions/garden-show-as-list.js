'use strict';

const gardenResponse = require('../responses/garden');

module.exports = (app) => {
  const { garden } = app;

  if (!garden.plants.length) {
    gardenResponse.showAsListHasNoPlants(app);
  } else if (garden.plants.length === 1) {
    gardenResponse.showAsListHasOnly1Plant(app);
  } else {
    gardenResponse.showAsList(app);
  }
};
