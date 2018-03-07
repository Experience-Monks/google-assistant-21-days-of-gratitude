'use strict';

const utils = require('../../../utils/utils');
const { strings } = require('../constants');

module.exports.exit = (app) => {
  const { exit: copy } = strings.general;
  const response = utils.randomString(copy);
  app.tell(response);
};
