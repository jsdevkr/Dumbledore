const Dumbledore = require('../lib/dumbledore');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_DB_PATH: the path of the SQLite database used by the bot
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 *  BOT_GITHUB_CHANNEL_ID: If your team uses a github slack channel for alerts, The Gitub Channel Id goes here.
 */

const dumbledore = new Dumbledore({
  token: 'xoxb-248266143441-zgzDCId1tMbBG7GKaToXsUi2',
  dbPath: process.env.BOT_DB_PATH,
  name: 'bot1',
  githubChannel: '#lee'
});

console.log('Start +Dumbledore bot+ on your slack channel.');
dumbledore.run();
