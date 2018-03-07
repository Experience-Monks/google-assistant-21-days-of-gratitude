'use strict';

const lastPrompt = require('../responses/last-prompt');

module.exports = (app) => {
  const { garden, user } = app;
  
  if (user.isSXSW || user.isAdmin) {
    if (garden.getTodaysPlant()) {
      garden.plants.pop();
      garden.update()
        .then(() => app.ask('Todays plant deleted.'))
        .catch(() => app.ask('Could not delete todays plant.'));
    } else {
      app.ask('No plant for today.');
    }
  } else {
    lastPrompt.add(app);
  }
};
