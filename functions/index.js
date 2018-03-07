'use strict';

require('./src/config');
require('./src/utils/admin');

const fulfillmentEntryPoint = require('./src/entrypoints/dialogflow');
const frontendEntryPoint = require('./src/entrypoints/frontend');

module.exports.fulfillmentEntryPoint = fulfillmentEntryPoint;
module.exports.shareFlower = frontendEntryPoint;
