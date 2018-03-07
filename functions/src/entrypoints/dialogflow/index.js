'use strict';

const functions = require('firebase-functions');
const { SECURITY_HEADER } = require('../../config');
const GardenApp = require('./app/garden-app');
const log = require('../../utils/log');

module.exports = functions.https.onRequest((request, response) => {
  const securityHeader = request.headers['x-security-content'];
  
  if(securityHeader === SECURITY_HEADER) {
    log.info('Dialog > success');
    const app = new GardenApp({ request, response });
    app.run();
  } else {
    log.error('Dialog > error > securiy headers dont match');
    response.sendStatus(401);
  }
});
