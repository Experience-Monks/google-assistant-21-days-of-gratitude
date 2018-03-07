'use strict';

const lastPrompt = require('../responses/last-prompt');

module.exports = (app) => {
  const { garden, user } = app;

  if (user.isSXSW || user.isAdmin) {
    const amount = app.getArgument('gratitudeDays') || 5;
    garden.sxswImportPlants(amount)
      .then(() => app.ask('All plants imported'))
      .catch(() => app.ask('Could not import plants'));
  } else {
    lastPrompt.add(app);
  }
};
