'use strict';

const exitResponse = require('../responses/exit');

module.exports = (app) => {
  exitResponse.exit(app);
};