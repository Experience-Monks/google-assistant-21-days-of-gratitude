'use strict';

require('dotenv').config();
const functions = require('firebase-functions');

let GCLOUD_PROJECT;
let PROJECT_ENV;
let SECURITY_HEADER;
let SXSW_USERS;
let ADMIN_USERS;
let TOKEN_FOR_USER_ID;
let DAILY_UPDATES_FOR_GOOGLE_HOME;
const FUNCTIONS_EMULATOR = process.env.FUNCTIONS_EMULATOR === 'true';

if (FUNCTIONS_EMULATOR === true) {
  GCLOUD_PROJECT = process.env.GCLOUD_PROJECT;
  PROJECT_ENV = process.env.PROJECT_ENV;
  SECURITY_HEADER = process.env.SECURITY_HEADER;
  SXSW_USERS = process.env.SXSW_USERS;
  ADMIN_USERS = process.env.ADMIN_USERS;
  TOKEN_FOR_USER_ID = process.env.TOKEN_FOR_USER_ID;
  DAILY_UPDATES_FOR_GOOGLE_HOME = process.env.DAILY_UPDATES_FOR_GOOGLE_HOME;
} else {
  GCLOUD_PROJECT = functions.config().project.gcloud_project;
  PROJECT_ENV = functions.config().project.project_env;
  SECURITY_HEADER = functions.config().project.security_header;
  SXSW_USERS = functions.config().project.sxsw_users;
  ADMIN_USERS = functions.config().project.admin_users;
  TOKEN_FOR_USER_ID = functions.config().project.token_for_user_id;
  DAILY_UPDATES_FOR_GOOGLE_HOME = functions.config().project.daily_updates_for_google_home;
}

SXSW_USERS = typeof SXSW_USERS === 'string' ? SXSW_USERS.split(',') : [];
ADMIN_USERS = typeof ADMIN_USERS === 'string' ? ADMIN_USERS.split(',') : [];
DAILY_UPDATES_FOR_GOOGLE_HOME = DAILY_UPDATES_FOR_GOOGLE_HOME === 'true';
const APP_URL = `https://${GCLOUD_PROJECT}.firebaseapp.com/`;

module.exports = {
  APP_URL,
  FUNCTIONS_EMULATOR,
  GCLOUD_PROJECT,
  PROJECT_ENV,
  SECURITY_HEADER,
  SXSW_USERS,
  ADMIN_USERS,
  TOKEN_FOR_USER_ID,
  DAILY_UPDATES_FOR_GOOGLE_HOME,
};
