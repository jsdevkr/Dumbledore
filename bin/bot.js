const Dumbledore = require('../lib/dumbledore');
const ParseInstance = require('../parse-server/parse');
const WebInstance = require('../server/app');
const Parse = require('parse/node');
const { atob } = require('../lib/helper/common');
const { DB } = require('../lib/word');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
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
});

// web server
const webServer = new WebInstance({
  port: process.env.PORT,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.PARSE_EXTERNAL_URL || process.env.SERVER_URL,
  user: process.env.ADMIN_NAME,
  pass: process.env.ADMIN_PASS,
});

// bots keep
const bots = {};
async function createBot() {
  try {
    // dumbledore bot
    const query = new Parse.Query(DB.BOT.CALL);
    await query.each((o) => {
      const token = o.get(DB.BOT.BOT_API_KEY);
      const name = o.get(DB.BOT.BOT_NAME);

      if (bots[token]) return;

      // new
      bots[token] = new Dumbledore({ token, name, id: o.id });
      bots[token].run().then(() => {
        console.log('Start *Dumbledore [' + name + ']* on your slack channel.');
      }, console.error);
    });
  } catch (e) {
    console.log('Start *Dumbledore* createBot error', e);
  }
}

async function startBot() {
  try {
    await parseServer.create();
    await webServer.create();

    // parse js sdk
    Parse.initialize(process.env.APP_ID || 'myAppId', null, process.env.MASTER_KEY || 'masterKey');
    Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

    if (process.env.NODE_ENV === 'development') {
      const query = new Parse.Query(DB.BOT.CALL);
      const botCount = await query.count();

      if (!botCount) {
        const name = process.env.BOT_NAME;

        // base64 encoded token
        let token = process.env.BOT_API_KEY;
        if (token.length > 42) token = atob(token);

        const obj = new Parse.Object(DB.BOT.CALL);
        await obj.save({
          [DB.BOT.BOT_NAME]: name,
          [DB.BOT.BOT_API_KEY]: token
        });
      }
    }

    createBot();
    // TODO : fix later
    setInterval(() => {
      createBot();
    }, 10000);
  } catch (error) {
    return console.log(error);
  }
}
startBot();
