import Parse from 'parse';

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
  // Todo: create logic for get bot
  const botDummy = new Array(10).fill(undefined).map((e, idx) => (
    {
      id: idx,
      name: `bot ${idx}`,
      point: `${idx * 100}`
    }
  )).sort((a, b) => b.point - a.point);

  await fakeAsync();

  return botDummy;
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

export function createBot(key, password) {
  const response = { key, password };
  // Todo: create logic for add bot
  return response;
}

