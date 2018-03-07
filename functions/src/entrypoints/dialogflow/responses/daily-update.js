'use strict';

const utils = require('../../../utils/utils');
const { strings } = require('../constants');
const lastPromptResponse = require('../responses/last-prompt');

const normalResponse = (app, copy) => {
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  lastPromptResponse.add(app, response);
  app.ask(response);
};

module.exports.saysYes = (app) => {
  const { saysYes: copy } = strings.dailyUpdate;
  normalResponse(app, copy);
};

module.exports.saysNo = (app) => {
  const { saysNo: copy } = strings.dailyUpdate;
  normalResponse(app, copy);
};
