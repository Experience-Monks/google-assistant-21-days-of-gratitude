'use strict';

const plantResponse = require('../responses/plant');

module.exports = (app) => {
  plantResponse.searchImplicitTrigger(app);
};
