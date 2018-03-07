'use strict';

const utils = require('../../../utils/utils');
const strings = require('../constants').strings;

module.exports.fallback = (app) => {
  let response;
  if (app.data.lastPrompt) {
    const simpleFallBack = {
      simpleResponse: app.buildSimpleResponseHelper(strings.general.fallback[app.data.fallbackCount - 1])
    };
    if (app.data.addedSimpleFallBack && app.data.addedSimpleFallBack === 'true') {
      app.data.lastPrompt.items[0] = simpleFallBack;
    } else {
      if(app.data.lastPrompt.items.length > 1 && app.data.lastPrompt.items[0] && app.data.lastPrompt.items[0].simpleResponse && app.data.lastPrompt.items[0].simpleResponse.textToSpeech){
        app.data.lastPrompt.items[0].simpleResponse.textToSpeech = strings.general.fallback[app.data.fallbackCount - 1]+" "+app.data.lastPrompt.items[0].simpleResponse.textToSpeech;
      } else {
        app.data.lastPrompt.items.unshift(simpleFallBack);
      }
      app.data.addedSimpleFallBack = 'true';
    }
    response = app.buildRichResponse(app.data.lastPrompt);
  } else {
    response = app.buildRichResponse();
    response.addSimpleResponse(strings.general.fallback[app.data.fallbackCount - 1]);
  }
  if (app.data.prompType) {
    switch (app.data.prompType) {
      case 'list': {
        if (app.data.lastList) {
          app.askWithList(response, app.data.lastList, true);
        } else {
          app.ask(response, [], true);
        }
        break;
      }
      case 'carousel': {
        if (app.data.lastCarousel) {
          app.askWithCarousel(response, app.data.lastCarousel, true);
        } else {
          app.ask(response, [], true);
        }
        break;
      }
      case 'text':
      default: {
        app.ask(response, [], true);
      }
    }
  } else {
    app.ask(response, [], true);
  }
};

module.exports.exit = (app) => {
  let response = app.buildRichResponse();
  response.addSimpleResponse(utils.randomString(strings.general.exit));
  app.tell(response);
};
