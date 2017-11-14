import Parse from 'parse';
import _ from 'lodash';
import { DB } from '../../../lib/const';

const { APP_ID, PARSE_EXTERNAL_URL } = process.env;

Parse.initialize(APP_ID);
Parse.serverURL = PARSE_EXTERNAL_URL;

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

export async function createBot(key, name, password) {
  const {
    CALL, BOT_API_KEY, BOT_NAME, PASSWORD
  } = DB.BOT;
  const query = new Parse.Query(DB.BOT.CALL);
  query.equalTo(BOT_API_KEY, key);

  try {
    const isExist = await query.find();
    if (isExist) {
      const bot = new Parse.Object(CALL);
      await bot.save({
        [BOT_NAME]: name,
        [BOT_API_KEY]: key,
        [PASSWORD]: password,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

