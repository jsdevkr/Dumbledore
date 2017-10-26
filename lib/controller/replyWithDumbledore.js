const random = require('random-js')();
const {
  INPUT, OUTPUT, HOUSE, DB
} = require('../word');

async function getAllHouseScores(originalMessage, callback) {
  const channel = await this.slackBot.getChannelById(originalMessage.channel);

  this.slackBot.postMessageToChannel(channel.name, 'The House Points are: \n', { as_user: true }, () => {
    Object.values(HOUSE).forEach(house => {
      this.getPointsFromDatabase.call(this, originalMessage, house, callback);
    });
  });
}

async function resetTheScores(originalMessage) {
  Object.values(HOUSE).forEach(h => {
    const house = new Parse.Object(DB.HOUSE.CALL);
    house.save({ name: h, val: 0 });
  });
  this.slackBot.announcePlainString(originalMessage, OUTPUT.RESET_SCORE);
}

function welcomeMessageManual(originalMessage) {
  this.slackBot.announcePlainString(originalMessage, OUTPUT.SAY_HELLO);
}

// Slacks API converts an @username reference in a message to the userid this converts it back to username.
async function convertToUserName(key) {
  const users = await this.slackBot.getUsers();
  return users.find((userid) => {
    if (userid.id === key || userid.name === key) {
      return userid.name;
    }
    return false;
  });
}

function greetNewStudent(originalMessage, student, house) {
  this.slackBot.announcePlainString(originalMessage, OUTPUT.canIJoin(student, house));
}

function addStudentToHouse(originalMessage, house) {
  // const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  const student = originalMessage.user;
  const studentUsername = convertToUserName(student);
  let notAlreadyStudent = true;
  const text = originalMessage.text.toLowerCase();

  this.db.all('SELECT * FROM students', (err, respond) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    if (respond !== undefined) {
      respond.find((dbUser) => {
        if (dbUser.user_id === student) {
          // this.slackBot.announcePlainString(originalMessage, studentUsername + ' You are already in a house. Once You have been sorted in that house you shall remain. But fear not, if you give it a chance you will see there is much to gain.', bot);
          notAlreadyStudent = false;
          return true;
        }
        return false;
      });
    }
    if (notAlreadyStudent === true) {
      // current not allow multiple house since callback return true
      Object.values(HOUSE).filter(t => text.includes(t) || house === t).some(v => {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, ?)', student, studentUsername, v, (_err) => {
          if (_err) {
            return console.error('DATABASE ERROR', _err);
          }
          greetNewStudent(originalMessage, studentUsername, v);
        });
        return true;
      });
    }
  });
}

function rollTheDice(originalMessage) {
  const house = random.integer(0, 3);

  addStudentToHouse.call(this, originalMessage, Object.values(HOUSE)[house], null);
}

async function obliviate(originalMessage) {
  const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  const query = new Parse.Query(DB.STUDENT.CALL);

  if (student === convertToUserName(originalMessage.user)) {
    query.equalTo('user_id', '');
    try {
      const results = await query.find();
      await Parse.Object.destroyAll(results);
      // Done
      this.slackBot.announcePlainString(originalMessage, OUTPUT.OBLIVIATE);
    } catch (error) {
      return console.error('DATABASE ERROR', error);
    }
  }
}


async function studentStats(originalMessage) {
  const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];

  if (convertToUserName(student) !== 'dumbledore') {
    const query = new Parse.Query(DB.STUDENT.CALL);
    query.equalTo('user_id', '');
    try {
      const record = await query.first();
      if (record.attributes !== undefined) {
        this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.student(record.attributes));
      } else {
        this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.NOT_FOUND);
      }
    } catch (err) {
      return console.error('DATABASE ERROR', err);
    }
  /*
    this.db.get('SELECT * FROM students WHERE user_id = ?', student, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record !== undefined) {
        this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.student(record));
      } else {
        this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.NOT_FOUND);
      }
    });
  */
  } else {
    this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.DUMBLEDORE);
  }
}

async function bestStudentHouse(house) {
  const query = new Parse.Query(DB.STUDENT.CALL);

  query.equalTo('name', house);
  query.descending('points_earned');
  try {
    const record = await query.first();
    return record;
  } catch (err) {
    console.error('DATABASE ERROR', err);
  }
  /* this.db.get('SELECT * FROM students WHERE house = ? ORDER BY points_earned DESC', house, (err, record) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    if (record !== undefined) {
      this.slackBot.announcePlainString(originalMessage, OUTPUT.getBestStudent(record));
    }
  }); */
}

function bestStudent(originalMessage) {
  Object.values(HOUSE).forEach(async (house) => {
    const record = await bestStudentHouse(house);
    this.slackBot.announcePlainString(originalMessage, OUTPUT.getBestStudent(record.attributes));
  });

  this.slackBot.announcePlainString(originalMessage, OUTPUT.ABOUT_FROGS);
}

async function worstStudentHouse(house) {
  const query = new Parse.Query(DB.STUDENT.CALL);

  query.equalTo('name', house);
  query.descending('points_taken');
  try {
    const record = await query.first();
    return record;
  } catch (err) {
    console.error('DATABASE ERROR', err);
  }
  /*
  Object.values(HOUSE).forEach((house) => {
    this.db.get('SELECT * FROM students WHERE house = ? ORDER BY points_taken DESC', house, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record !== undefined) {
        this.slackBot.announcePlainString(originalMessage, OUTPUT.getMeanestStudent(record));
      }
    });
  });
  */
}

async function worstStudent(originalMessage) {
  Object.values(HOUSE).forEach(async (house) => {
    const record = await worstStudentHouse(house);
    this.slackBot.announcePlainString(originalMessage, OUTPUT.getMeanestStudent(record.attributes));
  });
}

async function getAllStudentsFromHouse(house) {
  const query = new Parse.Query(DB.STUDENT.CALL);
  query.equalTo('house', house);
  try {
    const record = await query.find();
    return record;
  } catch (err) {
    console.error('DATABASE ERROR', err);
  }
  /*
    this.db.all('SELECT * FROM students WHERE house = ? ', house, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }

      this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.fromHouse(house, record));
    });
    */
}

function tellMeAbout(originalMessage, house) {
  const text = originalMessage.text.toLowerCase();

  if (text.includes('@')) {
    studentStats.call(this, originalMessage);
  } else if (house) {
    getAllStudentsFromHouse.call(this, originalMessage, house);
  } else if (text.includes(INPUT.PROFESSOR.JASON_MOM)) {
    this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.JASON_MOM);
  }
}

function getAllStudents(originalMessage) {
  Object.values(HOUSE).forEach(async (house) => {
    const record = await getAllStudentsFromHouse(house);
    this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.fromHouse(house, record));
  });
}

function explainSorting(originalMessage) {
  this.slackBot.announcePlainString(originalMessage, OUTPUT.START_SORTING);
}

function saveGitName(originalMessage) {
  const gitName = originalMessage.text.split('=')[1];
  const { user } = originalMessage;

  this.db.run('UPDATE students SET github_name = ? WHERE user_id = ?', gitName, user, (err) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    this.slackBot.announcePlainString(originalMessage, OUTPUT.saveGitName(convertToUserName(user), gitName));
  });
}

async function forceSortRemaining(originalMessage) {
  const users = await this.slackBot.getUsers();

  users.members.forEach((user) => {
    originalMessage.user = user.id;
    rollTheDice.call(this, originalMessage);
  });
}

function replyWithDumbledore(originalMessage) {
  const text = originalMessage.text.toLowerCase();
  const house = Object.values(HOUSE).find(v => text.includes(v));

  const parseCase = {
    [INPUT.PROFESSOR.GET_WINNER]: () => getAllHouseScores.call(this, originalMessage, this.slackBot.getAllHousePointsCallback),
    [INPUT.PROFESSOR.RESET_SCORE]: () => resetTheScores.call(this, originalMessage),
    [INPUT.PROFESSOR.SAY_HELLO]: () => welcomeMessageManual.call(this, originalMessage),
    [INPUT.PROFESSOR.CAN_I_JOIN]: () => addStudentToHouse.call(this, originalMessage, null, null /* this._studentJoinedHouse */),
    [INPUT.PROFESSOR.SORTING_HAT]: () => rollTheDice.call(this, originalMessage),
    [INPUT.PROFESSOR.OBLIVIATE]: () => obliviate.call(this, originalMessage),
    [INPUT.PROFESSOR.GET_BEST_STUDENT]: () => bestStudent.call(this, originalMessage),
    [INPUT.PROFESSOR.GET_MEANEST_STUDENT]: () => worstStudent.call(this, originalMessage),
    [INPUT.PROFESSOR.TELL_ME_ABOUT]: () => tellMeAbout.call(this, originalMessage, house),
    [INPUT.PROFESSOR.START_SORTING]: () => explainSorting.call(this, originalMessage),
    [INPUT.PROFESSOR.GET_HOGWARTS_ROSTER]: () => getAllStudents.call(this, originalMessage),
    [INPUT.PROFESSOR.SAVE_GIT_NAME]: () => saveGitName.call(this, originalMessage),
    [INPUT.PROFESSOR.SORT_REST]: () => forceSortRemaining.call(this, originalMessage)
  };

  Object.keys(parseCase).forEach(key => {
    if (text.includes(key)) {
      parseCase[key]();
    }
  });
}

module.exports = replyWithDumbledore;
