'use strict';

const utils = require('../../../utils/utils');
const { strings } = require('../constants');
const lastPromptResponse = require('./last-prompt');

const normalResponse = (app, copy) => {
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  lastPromptResponse.add(app, response);
  app.ask(response);
};

module.exports.general = (app) => {
  const { general: copy } = strings.error;
  normalResponse(app, copy);
};

module.exports.fatal = (app) => {
  const { fatal: copy } = strings.error;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  app.tell(response);
};
