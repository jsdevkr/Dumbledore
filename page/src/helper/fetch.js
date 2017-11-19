import Parse from 'parse';
import _ from 'lodash';
import { DB } from '../../../lib/const';

const { APP_ID, PARSE_EXTERNAL_URL } = process.env;

Parse.initialize(APP_ID);
Parse.serverURL = PARSE_EXTERNAL_URL;

function checkToken(token) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (!this.responseText) return;
      const res = JSON.parse(this.responseText);

      if (this.readyState === 4 && this.status === 200 && res.ok) {
        resolve(res);
      } else if (res.error) {
        reject(new Error(res.error));
      }
    };
    xhttp.open('GET', `https://slack.com/api/auth.test?token=${token}`, true);
    xhttp.send();
  });
}

export async function getBot() {
  const botQuery = new Parse.Query(DB.BOT.CALL);
  botQuery.select('botName');

  const result = await botQuery.find();

  return result.map(e => ({ id: e.id, botName: e.attributes.botName }));
}

export async function getAllStudent(botId) {
  const studentQuery = new Parse.Query(DB.STUDENT.CALL);
  studentQuery.equalTo('botId', botId).select('userName', 'point');

  const result = await studentQuery.find();

  return _.sortBy(result.map(e => ({
    id: e.id,
    userName: e.attributes.userName,
    point: e.attributes.point
  })), (result, t => -t.point));
}

export async function getUserName(userId) {
  const studentQuery = new Parse.Query(DB.STUDENT.CALL);
  studentQuery.equalTo('userId', userId).select('userName');

  const result = await studentQuery.first();

  return result.attributes.userName;
}

export async function createBot(key) {
  const {
    CALL, BOT_API_KEY, BOT_NAME
  } = DB.BOT;
  const botQuery = new Parse.Query(DB.BOT.CALL);
  botQuery.equalTo(BOT_API_KEY, key);

  try {
    const res = await checkToken(key);
    const bots = await botQuery.find();

    if (_.isEmpty(bots)) {
      const bot = new Parse.Object(CALL);
      await bot.save({
        [BOT_NAME]: res.user,
        [BOT_API_KEY]: key
      });
    } else {
      return Promise.reject(new Error('already existing token'));
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getLiveQuery(token) {
  const studentQuery = new Parse.Query(DB.MESSAGE.CALL);

  const botQuery = new Parse.Query(DB.BOT.CALL);
  botQuery.equalTo('botApi', token);
  const bot = await botQuery.first();

  studentQuery.equalTo('botId', bot.id);

  const subscription = studentQuery.subscribe();

  return subscription;
}

