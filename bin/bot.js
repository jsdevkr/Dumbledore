<<<<<<< HEAD
'use strict';

var Dumbledore = require('../lib/dumbledore');//Dumbledore변수에 dumbledore.js파일을 요청한다
=======
const Dumbledore = require('../lib/dumbledore');
>>>>>>> young/master

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_DB_PATH: the path of the SQLite database used by the bot
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 *  BOT_GITHUB_CHANNEL_ID: If your team uses a github slack channel for alerts, The Gitub Channel Id goes here.
 */

<<<<<<< HEAD
var token ='xoxb-248266143441-zgzDCId1tMbBG7GKaToXsUi2';// process.env.BOT_API_KEY;//token 변수에 api key값 저장
var dbPath ;//= process.env.BOT_DB_PATH;//dbPath변수에 bot dbpath 저장
var name = 'bot1';//name 변수에 bot이름 저장
var githubChannel = '#song97';//process.env.BOT_GITHUB_CHANNEL_ID;//githubChannel변수에 channel id 저장 

var dumbledore = new Dumbledore({//dumbledore변수에 Dumbledore객체 참조
    token: token,
    dbPath: dbPath,
    name: name,
    githubChannel: githubChannel
});


console.log("Start +Dumbledore bot+ on your slack channel.");
dumbledore.run();//dumbledore run 호출

=======
const dumbledore = new Dumbledore({
  token: process.env.BOT_API_KEY,
  dbPath: process.env.BOT_DB_PATH,
  name: process.env.BOT_NAME,
  githubChannel: process.env.BOT_GITHUB_CHANNEL_ID
});

console.log('Start +Dumbledore bot+ on your slack channel.');
dumbledore.run();
>>>>>>> young/master
