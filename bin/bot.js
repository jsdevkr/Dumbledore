const Dumbledore = require('../lib/dumbledore');
const ParseInstance = require('../parse-server/parse');
const Parse = require('parse/node');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_DB_PATH: the path of the SQLite database used by the bot
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 *  BOT_GITHUB_CHANNEL_ID: If your team uses a github slack channel for alerts, The Gitub Channel Id goes here.
 */

// parse-server
const server = new ParseInstance({
  databaseURI: process.env.DATABASE_URI,
  cloud: process.env.CLOUD_CODE_MAIN,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
  port: process.env.PORT,
  mountPath: process.env.MOUNT_PATH,
  user: process.env.ADMIN_NAME,
  pass: process.env.ADMIN_PASS,
});

server.create().then(() => {
  // parse js sdk
  Parse.initialize(process.env.APP_ID || 'myAppId', null, process.env.MASTER_KEY || 'masterKey');
  Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

  // dumbledore bot
  const dumbledore = new Dumbledore({
    token: process.env.BOT_API_KEY,
    dbPath: process.env.BOT_DB_PATH,
    name: process.env.BOT_NAME,
    githubChannel: process.env.BOT_GITHUB_CHANNEL_ID
  });

  dumbledore.run().then(() => {
    console.log('Start +Dumbledore bot+ on your slack channel.');
  }, console.error);
}, console.error);
