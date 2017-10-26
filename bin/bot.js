const Dumbledore = require('../lib/dumbledore');
const ParseInstance = require('../parse-server/app');
const webInstance = require('../server/app');
const Parse = require('parse/node');
const { atob } = require('../lib/helper/common');
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
const parseServer = new ParseInstance({
  databaseURI: process.env.DATABASE_URI,
  cloud: process.env.CLOUD_CODE_MAIN,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
  port: process.env.PARSE_PORT,
  mountPath: process.env.MOUNT_PATH,
  user: process.env.ADMIN_NAME,
  pass: process.env.ADMIN_PASS,
});

const webServer = new webInstance({
  setting: process.env.WEB_PORT
})

// parse js sdk
Parse.initialize(process.env.APP_ID || 'myAppId', null, process.env.MASTER_KEY || 'masterKey');
Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

// base64 encoded token
let token = process.env.BOT_API_KEY;
if (token.length > 42) token = atob(token);

// dumbledore bot
const dumbledore = new Dumbledore({
  token,
  dbPath: process.env.BOT_DB_PATH,
  name: process.env.BOT_NAME,
  githubChannel: process.env.BOT_GITHUB_CHANNEL_ID
});

(async function() {
  try {
    await parseServer.create();
  }catch(error) {
    console.log(error);
  }

  try {
    await webServer.create();    
  }catch(error) {
    console.log(error);
  }

  try {
    await dumbledore.run();
    console.log('Start +Dumbledore bot+ on your slack channel.');    
  } catch (error) {
    console.log(error);
  }
})();
