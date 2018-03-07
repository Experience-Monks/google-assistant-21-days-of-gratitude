'use strict';

const fallbackResponse = require('../responses/fallback');

module.exports = (app) => {
  app.data.fallbackCount = app.data.fallbackCount || 0;
  app.data.fallbackCount = parseInt(app.data.fallbackCount, 10);
  app.data.fallbackCount++;

  if (app.data.fallbackCount > 3) {
    fallbackResponse.exit(app);
  } else {
    fallbackResponse.fallback(app);
  }
};
