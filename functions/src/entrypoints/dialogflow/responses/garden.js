'use strict';

const { sprintf } = require('sprintf-js');
const msf = require('../../../utils/multi-surface');
const utils = require('../../../utils/utils');
const { contexts, strings } = require('../constants');
const actionKeys = require('../actions/keys');
const lastPromptResponse = require('./last-prompt');
const plantResponse = require('./plant');
const Garden = require('../../../model/garden');

const buildBasicCard = (app) => {
  const { garden } = app;
  const { fromPhone: copy } = strings.garden.show.hasPlants;
  const currentGardenDay = garden.getCurrentDay();
  const imageAccessibilityText = sprintf(copy.basiccard.imageAccessibilityText, currentGardenDay);

  return app.buildBasicCard()
    .setImage(garden.getBasiccardImageUrl(), imageAccessibilityText)
    .setImageDisplay('DEFAULT');
};

const showFromPhone = (app) => {
  const { garden } = app;
  const { fromPhone: copy } = strings.garden.show.hasPlants;
  const response = app.buildRichResponse();
  const firstResponse = sprintf(utils.randomString(copy.firstResponse), garden.plants.length);
  response.addSimpleResponse(firstResponse);
  response.addBasicCard(buildBasicCard(app));
  lastPromptResponse.add(app, response, actionKeys.GARDEN_SHOW);
  app.ask(response);
};

const showAsListFromPhone = (app) => {
  const { garden } = app;
  const { fromPhone: copy } = strings.garden.showAsList.has2PlantsOrMore;
  const firstResponse = sprintf(utils.randomString(copy.firstResponse), garden.plants.length);
  const list = app.buildList();

  garden.plants.forEach((item) => {
    const plant = garden.getPlantByDay(item.day);
    const itemTitle = `Day ${plant.day}: ${plant.title}`;
    const key = { type: "plant_list", value: plant.day };
    list.addItems(
      app.buildOptionItem(JSON.stringify(key), [`Day ${plant.day}`, plant.day.toString()])
        .setTitle(itemTitle)
        .setDescription(plant.userSaid)
        .setImage(plant.listImageUrl, itemTitle)
    );
  });

  app.askWithList(firstResponse, list);
};

function addCarousel(app) {
  const { garden } = app;
  const key1 = { type: 'choose_palette', value: Garden.TYPE_1 };
  const key2 = { type: 'choose_palette', value: Garden.TYPE_2 };
  const [image1, image2] = garden.getPaletteImagesUrls();
  const copy1 = strings.garden.changePalette.saysYes.options[0];
  const copy2 = strings.garden.changePalette.saysYes.options[1];

  return app.buildCarousel()
    .addItems(app.buildOptionItem(JSON.stringify(key1), copy1.synonyms)
      .setTitle(copy1.title)
      .setImage(image1, copy1.title))
    .addItems(app.buildOptionItem(JSON.stringify(key2), copy2.synonyms)
      .setTitle(copy2.title)
      .setImage(image2, copy2.title));
}

const normalResponse = (app, copy) => {
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  lastPromptResponse.add(app, response);
  app.ask(response);
};

module.exports.buildBasicCard = buildBasicCard;

// CHANGE PALETTE

module.exports.changePalette = (app, response = null) => {
  const withResponse = response ? true : false;
  const { inviteUser: copy, chips } = strings.garden.changePalette;
  const firstResponse = utils.randomString(copy);
  response = response || app.buildRichResponse();
  response.addSimpleResponse(firstResponse);
  response.addSuggestions(chips);
  app.setContext(contexts.GARDEN_CHANGE_PALETTE);

  if (!withResponse) {
    app.ask(response);
  }
};

module.exports.changePaletteSaysYes = (app, response = null) => {
  const { text: copy } = strings.garden.changePalette.saysYes;
  const firstResponse = utils.randomString(copy);
  response = response || app.buildRichResponse();
  response.addSimpleResponse(firstResponse);
  app.setContext(contexts.GARDEN_CHOOSING_PALETTE);
  app.askWithCarousel(response, addCarousel(app));
};

module.exports.changePaletteSaysNo = (app) => {
  const { saysNo: copy } = strings.garden.changePalette;
  normalResponse(app, copy);
};

module.exports.changePaletteFallback = (app) => {
  const { fallback: copy, chips} = strings.garden.changePalette;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  response.addSuggestions(chips);
  app.setContext(contexts.GARDEN_CHANGE_PALETTE);
  app.ask(response);
};

module.exports.changePaletteSuccess = (app) => {
  const { garden } = app;
  const { success: copy } = strings.garden.changePalette.saysYes;
  const response = app.buildRichResponse();
  const plant = garden.getTodaysPlant();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);

  if (plant) {
    response.addBasicCard(plantResponse.buildBasicCard(app, plant));
  }

  lastPromptResponse.add(app, response, actionKeys.GARDEN_SHOW);
  app.ask(response);
};

module.exports.choosingPaletteFallback = (app) => {
  const { fallback: copy } = strings.garden.changePalette.saysYes;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  app.setContext(contexts.GARDEN_CHOOSING_PALETTE);
  app.askWithCarousel(response, addCarousel(app));
};

// SHOW

module.exports.show = (app) => {
  const multiSurface = msf(app);
  const { fromGoogleHome: copyGoogleHome } = strings.garden.show.hasPlants;

  if (multiSurface.hasScreen) {
    showFromPhone(app);
  } else if (multiSurface.hasAvailableScreen) {
    const tellUser = utils.randomString(copyGoogleHome.hasAvailableScreens.inviteToSeeIt);
    const notificationTitle = utils.randomString(copyGoogleHome.hasAvailableScreens.notificationTitle);
    const contextName = contexts.NEW_SURFACE_GARDEN_SHOW;
    multiSurface.askForNewSurface(tellUser, notificationTitle, contextName);
  } else {
    const response = app.buildRichResponse();
    response.addSimpleResponse(utils.randomString(copyGoogleHome.noAvailableScreens));
    lastPromptResponse.add(app, response);
    app.ask(response);
  }
};

module.exports.showThatMovedToPhone = (app) => {
  showFromPhone(app);
};

module.exports.showThatStayedOnGoogleHome = (app) => {
  const { saysNo: copy } = strings.garden.show.hasPlants.fromGoogleHome.hasAvailableScreens;
  normalResponse(app, copy);
};

module.exports.showHasNoPlants = (app) => {
  const { hasNoPlants: copy } = strings.garden.show;
  normalResponse(app, copy);
};

// SHOW AS LIST

module.exports.showAsList = (app) => {
  const multiSurface = msf(app);
  const { fromGoogleHome: copyGoogleHome } = strings.garden.showAsList.has2PlantsOrMore;

  if (multiSurface.hasScreen) {
    showAsListFromPhone(app);
  } else if (multiSurface.hasAvailableScreen) {
    const tellUser = utils.randomString(copyGoogleHome.hasAvailableScreens.inviteToSeeIt);
    const notificationTitle = utils.randomString(copyGoogleHome.hasAvailableScreens.notificationTitle);
    const contextName = contexts.NEW_SURFACE_GARDEN_SHOW_AS_LIST;
    multiSurface.askForNewSurface(tellUser, notificationTitle, contextName);
  } else {
    const response = app.buildRichResponse();
    response.addSimpleResponse(utils.randomString(copyGoogleHome.noAvailableScreens));
    lastPromptResponse.add(app, response);
    app.ask(response);
  }
};

module.exports.showAsListThatMovedToPhone = (app) => {
  showAsListFromPhone(app);
};

module.exports.showAsListThatStayedOnGoogleHome = (app) => {
  const { hasAvailableScreens: copy } = strings.garden.showAsList.has2PlantsOrMore.fromGoogleHome.hasPlants;
  normalResponse(app, copy);
};

module.exports.showAsListHasNoPlants = (app) => {
  const { hasNoPlants: copy } = strings.garden.showAsList;
  normalResponse(app, copy);
};

module.exports.showAsListHasOnly1Plant = (app) => {
  const { hasOnly1Plant: copy } = strings.garden.showAsList;
  normalResponse(app, copy);
};

// RESTART

module.exports.restart = (app, copy) => {
  copy = copy || strings.garden.restart.confirm;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  response.addSuggestions(strings.garden.restart.chips);
  app.setContext(contexts.GARDEN_RESTART);
  app.ask(response);
};

module.exports.restartSaysYes = (app) => {
  const { saysYes: copy } = strings.garden.restart;
  normalResponse(app, copy);
};

module.exports.restartSaysNo = (app) => {
  const { saysNo: copy } = strings.garden.restart;
  normalResponse(app, copy);
};

module.exports.restartFallback = (app) => {
  module.exports.restart(app, strings.garden.restart.fallBack);
};
