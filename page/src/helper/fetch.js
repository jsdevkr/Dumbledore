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
  const bot = Parse.Object.extend('Bot');
  const botQuery = new Parse.Query(bot);
  botQuery.select('botName');

  const result = await botQuery.find();

  return result.map(e => ({ id: e.id, botName: e.attributes.botName }));
}

export async function getStudent(botId) {
  const student = Parse.Object.extend('Student');
  const studentQuery = new Parse.Query(student);
  studentQuery.equalTo('botId', botId).select('userName', 'point');

  const result = await studentQuery.find();

  return _.sortBy(result.map(e => ({
    id: e.id,
    userName: e.attributes.userName,
    point: e.attributes.point
  })), (result, t => -t.point));
}

export async function createBot(key) {
  const {
    CALL, BOT_API_KEY, BOT_NAME
  } = DB.BOT;
  const query = new Parse.Query(DB.BOT.CALL);
  query.equalTo(BOT_API_KEY, key);

  try {
    const res = await checkToken(key);
    const isExist = await query.find();

    if (isExist) {
      const bot = new Parse.Object(CALL);
      await bot.save({
        [BOT_NAME]: res.user,
        [BOT_API_KEY]: key
      });
    }
  } catch (error) {
    return Promise.reject(new Error(error));
  }
}

