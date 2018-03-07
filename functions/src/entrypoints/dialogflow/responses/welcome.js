'use strict';

const utils = require('../../../utils/utils');
const { strings } = require('../constants');
const actionKeys = require('../actions/keys')
const gardenResponse = require('./garden');
const lastPromptResponse = require('./last-prompt');

const normalResponse = (app, copy) => {
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  lastPromptResponse.add(app, response);
  app.ask(response);
};

module.exports.onboarding = (app) => {
  const { onboarding: copy } = strings.welcome;
  normalResponse(app, copy);
};

module.exports.hasNotSavedTodaysSession = (app) => {
  const { user } = app;
  const copy = user.isSXSW ? strings.welcome.onboarding : strings.welcome.hasNotSavedTodaysSession;
  normalResponse(app, copy);
};

module.exports.hasSavedTodaysSession = (app) => {
  const { hasSavedTodaysSession: copy } = strings.welcome;
  normalResponse(app, copy);
};

module.exports.hasFinishedGarden = (app) => {
  const { hasFinishedGarden: copy } = strings.welcome;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  response.addBasicCard(gardenResponse.buildBasicCard(app));
  lastPromptResponse.add(app, response, actionKeys.GARDEN_SHOW);
  app.ask(response);
};
