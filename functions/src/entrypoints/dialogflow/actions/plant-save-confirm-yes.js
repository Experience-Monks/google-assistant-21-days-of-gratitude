'use strict';

const { contexts } = require('../constants');
const plantResponse = require('../responses/plant');

module.exports = (app, actionName) => {
  const contextArgument = app.getContextArgument(contexts.PLANT_SAVE_CONFIRM, 'userSaid');

  if (contextArgument) {
    const { garden } = app;
    const { value: userSaid } = contextArgument;

    garden.savePlant(userSaid)
      .then(plant => {
        if (plant) {
          plantResponse.saved(app, plant);
        } else {
          plantResponse.hasAlreadySavedToday(app);
        }
      })
      .catch(err => {
        throw err;
      });
  } else {
    throw new Error(`${actionName} > invalid contextArgument`);
  }
};
