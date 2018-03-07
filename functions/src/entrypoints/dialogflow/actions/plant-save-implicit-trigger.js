'use strict';

const lastPromptResponse = require('../responses/last-prompt');
const plantResponse = require('../responses/plant');

module.exports = (app) => {
  const { garden } = app;

  if (!garden.hasSavedTodaysSession()) {
    lastPromptResponse.add(app);
  } else {
    plantResponse.hasAlreadySavedToday(app);
  }
};
