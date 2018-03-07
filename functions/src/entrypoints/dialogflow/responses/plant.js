'use strict';

const { sprintf } = require('sprintf-js');
const { APP_URL } = require('../../../config');
const utils = require('../../../utils/utils');
const msf = require('../../../utils/multi-surface');
const { contexts, strings, } = require('../constants');
const gardenResponse = require('./garden');
const lastPromptResponse = require('./last-prompt');
const actionKeys = require('../actions/keys');

const buildBasicCard = (app, plant) => {
  const { id: gardenId } = app.garden;
  const { title, description, button: basiccardButton } = strings.plant.basiccard;
  const basiccardTitle = sprintf(utils.randomString(title), plant.day, plant.title)
  const basiccardFormattedText = sprintf(utils.randomString(description), plant.userSaid);

  return app.buildBasicCard(basiccardFormattedText)
    .setTitle(basiccardTitle)
    .setImage(plant.basiccardImageUrl, plant.userSaid)
    .setImageDisplay('DEFAULT')
    .addButton(basiccardButton, `${APP_URL}?gardenId=${gardenId}&plantDay=${plant.day}`);
};

const savedFromPhone = (app, plant) => {
  const { garden } = app;
  const { fromPhone: copy } = strings.plant.saved;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  response.addBasicCard(buildBasicCard(app, plant));

  if(garden.plants.length === 1){
    gardenResponse.changePalette(app, response);
  } else {
    lastPromptResponse.add(app, response);
  }

  app.ask(response);
};

const searchFromPhone = (app, plant) => {
  const { fromPhone: copy } = strings.plant.search.foundPlant;
  const response = app.buildRichResponse();
  const firstResponse = sprintf(utils.randomString(copy), plant.day);
  response.addSimpleResponse(firstResponse);
  response.addBasicCard(buildBasicCard(app, plant));
  lastPromptResponse.add(app, response);
  app.ask(response);
};

const normalResponse = (app, copy) => {
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  lastPromptResponse.add(app, response);
  app.ask(response);
};

module.exports.buildBasicCard = buildBasicCard;

// PROFANITY DETECTED

module.exports.profanityDetected = (app) => {
  const { profanityDetected: copy } = strings.plant;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  app.setContext(contexts.PLANT_SAVE_IMPLICIT);
  app.ask(response);
};

// ALREADY SAVED TODAY

module.exports.hasAlreadySavedToday = (app) => {
  const { hasAlreadySavedToday: copy } = strings.plant
  normalResponse(app, copy);
};

// SAVE IMPLICIT

module.exports.saveImplicitExit = (app) => {
  const { exit: copy } = strings.plant.saveImplicit;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  lastPromptResponse.add(app, response, actionKeys.PLANT_SAVE_IMPLICIT_EXIT);
  app.ask(response);
};

// SAVE CONFIRM

module.exports.saveConfirm = (app, userSaid) => {
  const { ask: copy, chips } = strings.plant.saveConfirm;
  const response = app.buildRichResponse();
  const firstResponse = sprintf(utils.randomString(copy), userSaid);
  response.addSimpleResponse(firstResponse);
  response.addSuggestions(chips);
  app.setContext(contexts.PLANT_SAVE_CONFIRM, 1, { userSaid });
  app.ask(response);
};

module.exports.saveConfirmNo = (app) => {
  const { saysNo: copy } = strings.plant.saveConfirm;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  app.setContext(contexts.PLANT_SAVE_IMPLICIT);
  app.ask(response);
};

module.exports.saveConfirmFallback = (app, userSaid) => {
  const {ask: copy} = strings.plant.saveConfirm;
  const response = app.buildRichResponse();
  const firstResponse = sprintf(utils.randomString(copy), userSaid);
  response.addSimpleResponse(firstResponse);
  app.setContext(contexts.PLANT_SAVE_CONFIRM, 1, { userSaid });
  app.ask(response);
};

// EDIT

module.exports.edit = (app) => {
  const { edit: copy } = strings.plant;
  normalResponse(app, copy);
};

// SAVED

module.exports.saved = (app, plant) => {
  const multiSurface = msf(app);
  const { fromGoogleHome } = strings.plant.saved;

  if (multiSurface.hasScreen) {
    savedFromPhone(app, plant);
  } else if (multiSurface.hasAvailableScreen) {
    const tellUser = utils.randomString(fromGoogleHome.hasAvailableScreens.inviteToSeeIt);
    const notificationTitle = utils.randomString(fromGoogleHome.hasAvailableScreens.notificationTitle);
    const contextName = contexts.NEW_SURFACE_PLANT_SAVED;
    const contextParams = { plantDay: plant.day };
    multiSurface.askForNewSurface(tellUser, notificationTitle, contextName, contextParams);
  } else {
    const response = app.buildRichResponse();
    response.addSimpleResponse(fromGoogleHome.noAvailableScreens);
    lastPromptResponse.add(app, response);
    app.ask(response);
  }
};

module.exports.savedThatMovedToPhone = (app, plant) => {
  savedFromPhone(app, plant);
};

module.exports.savedThatStayedOnGoogleHome = (app) => {
  const { saysNo: copy } = strings.plant.saved.fromGoogleHome.hasAvailableScreens;
  normalResponse(app, copy);
};

// SEARCH

module.exports.searchImplicitTrigger = (app) => {
  const { noDay: copy } = strings.plant.search;
  const simpleResponse = utils.randomString(copy);
  app.setContext(contexts.PLANT_SEARCH_IMPLICIT);
  app.ask(simpleResponse);
};

module.exports.search = (app, plant) => {
  const multiSurface = msf(app);
  const { fromGoogleHome: copy } = strings.plant.search.foundPlant;

  if (multiSurface.hasScreen) {
    searchFromPhone(app, plant)
  } else if (multiSurface.hasAvailableScreen) {
    const tellUser = utils.randomString(copy.hasAvailableScreens.inviteToSeeIt);
    const notificationTitle = utils.randomString(copy.hasAvailableScreens.notificationTitle);
    const contextName = contexts.NEW_SURFACE_PLANT_SEARCH;
    const contextParams = { plantDay: plant.day };
    multiSurface.askForNewSurface(tellUser, notificationTitle, contextName, contextParams);
  } else {
    const response = app.buildRichResponse();
    response.addSimpleResponse(copy.noAvailableScreens);
    lastPromptResponse.add(app, response);
    app.ask(response);
  }
};

module.exports.searchThatMovedToPhone = (app, plant) => {
  savedFromPhone(app, plant);
};

module.exports.searchThatStayedOnGoogleHome = (app) => {
  const { saysNo: copy } = strings.plant.search.foundPlant.fromGoogleHome.hasAvailableScreens;
  normalResponse(app, copy);
};

module.exports.searchCantFindPlant = (app) => {
  const { cantFindPlant: copy } = strings.plant.search;
  normalResponse(app, copy);
};

// SHOW

module.exports.show = (app, plant) => {
  searchFromPhone(app, plant);
};

module.exports.showCantFindPlant = (app) => {
  const { cantFindPlant: copy } = strings.plant.search;
  normalResponse(app, copy);
}
