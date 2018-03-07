'use strict';

const helpResponse = require('../responses/help');

module.exports = (app) => {
  helpResponse.help(app);
};
