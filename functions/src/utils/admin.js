'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { FUNCTIONS_EMULATOR, GCLOUD_PROJECT } = require('../config');

if (FUNCTIONS_EMULATOR) {
  const serviceAccount = require(`../../.credential-${GCLOUD_PROJECT}.json`);

  functions.config = function() {
    return {
      firebase: {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${GCLOUD_PROJECT}.firebaseio.com`,
        storageBucket: `${GCLOUD_PROJECT}.appspot.com`,
      }
    };
  };
}

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

module.exports = {
  db,
  admin
};
