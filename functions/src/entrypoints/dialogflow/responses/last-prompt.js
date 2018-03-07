'use strict';

const { sprintf } = require('sprintf-js');
const utils = require('../../../utils/utils');
const msf = require('../../../utils/multi-surface');
const { contexts, strings } = require('../constants');
const actionKeys = require('../actions/keys');

const shuffleArray = (x) => {
  const a = x.slice(0);

  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

const getCustomGratitudeChips = () => {
  const { chips } = strings.lastPrompt.hasNotSavedTodaysSession;
  const shuffledChips = shuffleArray(chips);

  return shuffledChips.length > 8 ? shuffledChips.slice(0, 8) : shuffledChips;
}

const addDailyUpdateChip = (app, chips) => {
  const { user } = app;
  const { dailyUpdateChip: chip } = strings.lastPrompt;

  return !user.hasDailyUpdate ? [chip].concat(chips) : chips;
}

const joinArrayWithOrAtTheEnd = (array) => {
  return array.reduce((accumulator, currentValue, currentIndex) => {
    if (currentIndex === 0) accumulator += currentValue;
    else if (currentIndex === array.length - 1) accumulator += ' or ' + currentValue;
    else accumulator += ', ' + currentValue;
    return accumulator;
  }, '');
};

const showSaveSession = (app, response) => {
  const multiSurface = msf(app);
  const { garden } = app;
  const { hasNotSavedTodaysSession: copy } = strings.lastPrompt;
  const currentGardenDay = garden.getCurrentDay();
  const chips = getCustomGratitudeChips();
  const simpleResponseDisplayText = sprintf(utils.randomString(copy.displayText), currentGardenDay);
  const speechWithCurrentDay = sprintf(utils.randomString(copy.speech), currentGardenDay);
  const simpleResponseSpeech = `${speechWithCurrentDay} ${joinArrayWithOrAtTheEnd(chips.slice(0,3))}</speak>`;
  const simpleResponse = multiSurface.hasScreen 
    ? { speech: simpleResponseSpeech, displayText: simpleResponseDisplayText }
    : simpleResponseSpeech;
  response.addSimpleResponse(simpleResponse);
  response.addSuggestions(chips);
  app.setContext(contexts.PLANT_SAVE_IMPLICIT);
};

const showMenu = (app, response, actionName = null) => {
  const multiSurface = msf(app);
  let copy;
  let chips;

  if (actionName === actionKeys.PLANT_SAVE_IMPLICIT_EXIT) {
    copy = strings.lastPrompt.hasNotSavedTodaysSession.menu;
    chips = copy.chips;
  } else {
    const { garden } = app;
    copy = strings.lastPrompt.hasSavedTodaysSession;
    chips = (actionName === actionKeys.GARDEN_SHOW && garden.plants.length > 1) ? copy.chipsWithShowGardenAsList : copy.chips;
  }

  chips = multiSurface.hasScreen ? addDailyUpdateChip(app, chips) : chips;
  const simpleResponseDisplayText = utils.randomString(copy.displayText);
  const simpleResponseSpeech = `${utils.randomString(copy.speech)} ${joinArrayWithOrAtTheEnd(chips)}</speak>`;
  const simpleResponse = multiSurface.hasScreen 
    ? { speech: simpleResponseSpeech, displayText: simpleResponseDisplayText }
    : simpleResponseSpeech;
  response.addSimpleResponse(simpleResponse);
  response.addSuggestions(chips);
};

const hasNotSavedTodaysSession = (app, response, actionName = null) => {
  if (actionName === actionKeys.PLANT_SAVE_IMPLICIT_EXIT) {
    showMenu(app, response, actionName)
  } else {
    showSaveSession(app, response);
  }
};

const hasSavedTodaysSession = (app, response, actionName) => {
  showMenu(app, response, actionName);
};

const hasFinishedGarden = (app, response) => {
  const multiSurface = msf(app);
  const { speech, displayText, chips } = strings.lastPrompt.hasFinishedGarden;
  const simpleResponseDisplayText = utils.randomString(displayText);
  const simpleResponseSpeech = `${utils.randomString(speech)} ${joinArrayWithOrAtTheEnd(chips)}</speak>`;
  const simpleResponse = multiSurface.hasScreen 
    ? { speech: simpleResponseSpeech, displayText: simpleResponseDisplayText }
    : simpleResponseSpeech;
  response.addSimpleResponse(simpleResponse);
  response.addSuggestions(chips);
};

module.exports.add = (app, response = null, actionName = null) => {
  const { garden } = app;
  const withResponse = response ? true : false;
  response = response || app.buildRichResponse();

  if (garden.hasFinished()) {
    hasFinishedGarden(app, response, actionName);
  } else if (!garden.hasSavedTodaysSession()) {
    hasNotSavedTodaysSession(app, response, actionName)
  } else {
    hasSavedTodaysSession(app, response, actionName);
  }

  if (!withResponse) {
    app.ask(response);
  }
};
