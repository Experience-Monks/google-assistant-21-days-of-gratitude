'use strict';

const Debug = require('debug');
const { DialogflowApp } = require('actions-on-google');
const uuidv4 = require('uuid/v4');
const log = require('../../../utils/log');
const actions = require('../actions');
const User = require('../../../model/user');
const Garden = require('../../../model/garden');
const errorResponse = require('../responses/error');

const debug = Debug('actions-on-google:debug');
const error = Debug('actions-on-google:error');
/**
 * Check if given text contains SSML.
 *
 * @param {string} text Text to check.
 * @return {boolean} True if text contains SSML, false otherwise.
 */
const isSsml = text => /^<speak\b[^>]*>([^]*?)<\/speak>$/gi.test(text);

/**
 * Check if given text contains SSML, allowing for whitespace padding.
 *
 * @param {string} text Text to check.
 * @return {boolean} True if text contains possibly whitespace padded SSML,
 *     false otherwise.
 */
const isPaddedSsml = text => /^\s*<speak\b[^>]*>([^]*?)<\/speak>\s*$/gi.test(text);

class GardenApp extends DialogflowApp {
  constructor(option) {
    super(option);
    this.id = uuidv4();
  }

  ask(inputPrompt, noInputs, isFallback) {
    isFallback = isFallback || false;
    if (!isFallback) {
      this.data.fallbackCount = 0;
    }
    this.data.prompType = 'text';
    this.data.lastPrompt = inputPrompt;
    super.ask(inputPrompt, noInputs);
  }

  askWithList(inputPrompt, list, isFallback) {
    isFallback = isFallback || false;
    if (!isFallback) {
      this.data.fallbackCount = 0;
    }
    this.data.lastPrompt = inputPrompt;
    this.data.promptype = 'list';
    this.data.lastList = list;
    super.askWithList(inputPrompt, list);
  }

  askWithCarousel(inputPrompt, carousel, isFallback) {
    isFallback = isFallback || false;
    if (!isFallback) {
      this.data.fallbackCount = 0;
    }
    this.data.lastPrompt = inputPrompt;
    this.data.prompType = 'carousel';
    this.data.lastCarousel = carousel;
    super.askWithCarousel(inputPrompt, carousel);
  }

  run() {
    log.info('GardenApp > run', { id: this.id, userId: this.getUser().userId });
    this.user = new User();
    this.garden = new Garden();
    this.user.loadById(this.getUser().userId)
      .then(() => {
        log.info('GardenApp > run > user loaded', { id: this.id, userId: this.user.getId() });
        return this.garden.loadById(this.user.gardenId)
      })
      .then(() => this.handleRequestAsync(actions))
      .then(result => log.info('GardenApp > run > result', { id: this.id, result }))
      .catch(err => {
        log.error('GardenApp > run > error', { id: this.id, err });
        errorResponse.general(this);
      });
  }

  /**
   * Helper to build SimpleResponse from speech and display text.
   *
   * @param {string|SimpleResponse} response String to speak, or SimpleResponse.
   *     SSML allowed.
   * @param {string} response.speech If using SimpleResponse, speech to be spoken
   *     to user.
   * @param {string=} response.displayText If using SimpleResponse, text to be shown
   *     to user.
   * @return {Object} Appropriate SimpleResponse object.
   */
  buildSimpleResponseHelper(response) {
    if (!response) {
      error('Invalid response');
      return null;
    }
    debug('buildSimpleResponseHelper_: response=%s', JSON.stringify(response));
    let simpleResponseObj = {};
    if (typeof response === 'string') {
      simpleResponseObj = isSsml(response) || isPaddedSsml(response)
        ? {ssml: response} : {textToSpeech: response};
    } else if (response.speech) {
      simpleResponseObj = isSsml(response.speech) || isPaddedSsml(response.speech)
        ? {ssml: response.speech} : {textToSpeech: response.speech};
      simpleResponseObj.displayText = response.displayText;
    } else {
      error('SimpleResponse requires a speech parameter.');
      return null;
    }
    return simpleResponseObj;
  }
}

module.exports = GardenApp;
