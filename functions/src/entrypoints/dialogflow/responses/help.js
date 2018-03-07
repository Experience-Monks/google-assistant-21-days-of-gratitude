'use strict';

const utils = require('../../../utils/utils');
const { strings } = require('../constants');
const lastPromptResponse = require('../responses/last-prompt');

module.exports.help = (app) => {
  const { text: copy } = strings.help;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  lastPromptResponse.add(app, response);
  app.ask(response);
};
