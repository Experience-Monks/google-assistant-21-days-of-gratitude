'use strict';

const { DAILY_UPDATES_FOR_GOOGLE_HOME } = require('../../../config');
const msf = require('../../../utils/multi-surface');
const lastPromptResponse = require('../responses/last-prompt');

module.exports = (app) => {
  const multiSurface = msf(app);

  if (multiSurface.hasScreen || DAILY_UPDATES_FOR_GOOGLE_HOME) {
    app.askToRegisterDailyUpdate('plant_save_implicit_trigger');
  } else {
    lastPromptResponse.add(app);
  }
};
