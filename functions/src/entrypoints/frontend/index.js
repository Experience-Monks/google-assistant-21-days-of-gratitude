'use strict';

const express = require('express');
const expressSanitizer = require('express-sanitizer');
const functions = require('firebase-functions');
const sanitizeHtml = require('sanitize-html');
const Garden = require('../../model/garden');
const html = require('./view');

const app = express();

app.use(expressSanitizer());

app.get('*', (request, response) => {
  const gardenId = sanitizeHtml(request.sanitize(request.query.gardenId));
  const plantDay = sanitizeHtml(request.sanitize(request.query.plantDay));
  const garden = new Garden();

  garden.loadById(gardenId)
    .then(() => {
      const plant = garden.getPlantByDay(plantDay);
      if (!plant) throw new Error('Plant not found.');
      const url = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com` + request.originalUrl;
      const htmlResult = html.header(url, plant) + html.success(url, plant, plantDay) + html.footer();
      response.status(200).send(htmlResult);
    })
    .catch(err => {
      console.error('Share Error:', err);
      const htmlResult = html.header() + html.error() + html.footer();
      response.status(503).send(htmlResult);
    });
});

module.exports = functions.https.onRequest(app);
