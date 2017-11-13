import Parse from 'parse';
import { DB } from '../../../lib/const';

const { APP_ID, SERVER_URL } = process.env;

Parse.initialize(APP_ID);
Parse.serverURL = SERVER_URL;

// const user = Parse.Object.extend('Student');
// const userQuery = new Parse.Query(user);
// userQuery.get('4ll0bZR4fW', {
//   success: el => {
//     console.log(el.get('userName'));
//   },
//   error: (object, error) => {
//     console.log(object);
//     console.log(error);
//     // The object was not retrieved successfully.
//     // error is a Parse.Error with an error code and message.
//   }
// });

async function fakeAsync(delayTime = 1000) {
  await new Promise(resolve => setTimeout(resolve, delayTime));
}

export async function getBot() {
  const bot = Parse.Object.extend('Bot');
  const botQuery = new Parse.Query(bot);
  botQuery.select('botName');

  const result = await botQuery.find();

  return result.map(e => ({ id: e.id, botName: e.attributes.botName }));
}

export async function getStudent(id) {
  // Todo: create logic for get student
  const studentDummy = new Array(10).fill(undefined).map((e, idx) => (
    {
      id: idx,
      name: `student ${idx}`,
      point: `${id * 10}`
    }
  )).sort((a, b) => b.point - a.point);

  await fakeAsync();

  return studentDummy;
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

