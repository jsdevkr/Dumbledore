const random = require("random-js")(); // uses the nativeMath engine
const getPointsFromDatabase = require('../helper/getPointsFromDatabase');
const botCommand = require('../helper/botCommand');
const { INPUT, OUTPUT, HOUSE } = require('../word');

function replyWithDumbledore(originalMessage) {
  const self = this;
  const text = originalMessage.text.toLowerCase();
  const house = Object.values(HOUSE).find(v => text.includes(v));

  const parseCase = {
    [INPUT.PROFESSOR.GET_WINNER]: () => {
      getAllHouseScores.call(self, originalMessage, botCommand.getAllHousePointsCallback);
    },
    [INPUT.PROFESSOR.RESET_SCORE]: () => {
      resetTheScores.call(self, botCommand.announcePlainString);
    },
    [INPUT.PROFESSOR.SAY_HELLO]: () => {
      welcomeMessageManual.call(self, originalMessage);
    },
    [INPUT.PROFESSOR.CAN_I_JOIN]: () => {
      addStudentToHouse.call(self, originalMessage, null, null /*self._studentJoinedHouse*/);
    },
    [INPUT.PROFESSOR.SORTING_HAT]: () => {
      rollTheDice.call(self, originalMessage);
    },
    [INPUT.PROFESSOR.OBLIVIATE]: () => {
      obliviate.call(self, originalMessage);
    },
    [INPUT.PROFESSOR.GET_BEST_STUDENT]: () => {
      bestStudent.call(self, originalMessage);
    },
    [INPUT.PROFESSOR.GET_MEANEST_STUDENT]: () => {
      worstStudent.call(self, originalMessage);
    },
    [INPUT.PROFESSOR.TELL_ME_ABOUT]: () => {
      if (text.includes('@')) {
        studentStats.call(self, originalMessage);
      } else if (!!house) {
        getAllStudentsFromHouse.call(self, originalMessage, house);
      } else if (text.includes('jason\'s mom')) {
        botCommand.announcePlainString(originalMessage, 'Not much is known about Jason\'s mom, except that she is thought to be responsible for the great internet unplugging of 2016', self);
      }
    },
    [INPUT.PROFESSOR.START_SORTING]: () => {
      explainSorting.call(self, originalMessage);
    },
    [INPUT.PROFESSOR.GET_HOGWARTS_ROSTER]: () => {
      getAllStudents.call(self, originalMessage);
    },
    [INPUT.PROFESSOR.SAVE_GIT_NAME]: () => {
      saveGitName.call(self, originalMessage);
    },
    [INPUT.PROFESSOR.SORT_REST]: () => {
      forceSortRemaining.call(self, originalMessage);
    }
  }

  Object.keys(parseCase).forEach(key => {
    if (text.includes(key)) {
      parseCase[key]();
    }
  })
}

async function getAllHouseScores(originalMessage, callback) {
  const channel = await this.getChannelById(originalMessage.channel);

  this.postMessageToChannel(channel.name, 'The House Points are: \n', { as_user: true }, () => {
    getPointsFromDatabase(originalMessage, HOUSE.GRYFFINDOR, this, callback);
    getPointsFromDatabase(originalMessage, HOUSE.HUFFLEPUFF, this, callback);
    getPointsFromDatabase(originalMessage, HOUSE.RAVENCLAW, this, callback);
    getPointsFromDatabase(originalMessage, HOUSE.SLYTHRIN, this, callback);
  });
};

function resetTheScores(originalMessage, callback) {
  this.db.run('UPDATE houses SET points = 0');
  callback(originalMessage, "The scores have been reset and we are ready for another great year at Hogwarts!", this);
}

function welcomeMessageManual(originalMessage) {
  botCommand.announcePlainString(originalMessage, 'Welcome to Hogwarts everyone!' +
    '\n Now, in a few moments you will pass through these doors and join your classmates, but before you take your seats, you must be sorted into your houses. They are Gryffindor, Hufflepuff, Ravenclaw, and Slytherin. Now while you\'re here, your house will be like your family. Your triumphs will earn you points. Any rule breaking, and you will lose points. At the end of the year, the house with the most points is awarded the house cup.' + '\n I Albus Dumbledore will award points on your behalf. Just say `10 points to Gryffindor` + or `5 points to @benc` to award points', this);
}

function addStudentToHouse(originalMessage, house, callback) {
  //const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  const student = originalMessage.user;
  const studentUsername = convertToUserName(this, student);
  let notAlreadyStudent = true;
  const text = originalMessage.text.toLowerCase();
  
  this.db.all('SELECT * FROM students', (err, respond) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    if (respond !== undefined) {
      for (let db_user of respond) {
        if (db_user.user_id == student) {
          // botCommand.announcePlainString(originalMessage, studentUsername + ' You are already in a house. Once You have been sorted in that house you shall remain. But fear not, if you give it a chance you will see there is much to gain.', bot);
          notAlreadyStudent = false;
          break;
        }
      }
    }
    if (notAlreadyStudent === true) {
      if (text.includes(HOUSE.GRYFFINDOR) || house == HOUSE.GRYFFINDOR) {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "gryffindor")', student, studentUsername, (err, respond) => {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          greetNewStudent.call(this, originalMessage, studentUsername, HOUSE.GRYFFINDOR);
        });
      } else if (text.includes(HOUSE.HUFFLEPUFF) || house == HOUSE.HUFFLEPUFF) {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "hufflepuff")', student, studentUsername, (err, respond) => {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          greetNewStudent.call(this, originalMessage, studentUsername, HOUSE.HUFFLEPUFF);
        });
      } else if (text.includes(HOUSE.RAVENCLAW) || house == HOUSE.RAVENCLAW) {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "ravenclaw")', student, studentUsername, (err, respond) => {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          greetNewStudent.call(this, originalMessage, studentUsername, HOUSE.RAVENCLAW);
        });
      } else if (text.includes(HOUSE.SLYTHRIN) || house == HOUSE.SLYTHRIN) {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "slytherin")', student, studentUsername, (err, respond) => {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          greetNewStudent.call(this, originalMessage, studentUsername, HOUSE.SLYTHRIN);
        });
      }
    }
  });
}

function greetNewStudent(originalMessage, student, house) {
  botCommand.announcePlainString(originalMessage, 'Welcome ' + student.capitalizeFirstLetter() + ' the house of ' + house.capitalizeFirstLetter() + ' expects great things from you!', this);
}

function rollTheDice(originalMessage) {
  const house = random.integer(0, 3);
  switch (house) {
    case 0:
      addStudentToHouse.call(this, originalMessage, HOUSE.GRYFFINDOR, null);
      break;
    case 1:
      addStudentToHouse.call(this, originalMessage, HOUSE.HUFFLEPUFF, null);
      break;
    case 2:
      addStudentToHouse.call(this, originalMessage, HOUSE.RAVENCLAW, null);
      break;
    case 3:
      addStudentToHouse.call(this, originalMessage, HOUSE.SLYTHRIN, null);
      break;
  };
}

function obliviate(originalMessage) {
  const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];

  if (student === originalMessage.user) {
    this.db.run('DELETE FROM students WHERE user_id = ?', student, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      botCommand.announcePlainString(originalMessage, 'Poof, even a remembrall wont help you now Gilderoy', this);
    });
  }
}

function studentStats(originalMessage) {
  const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];

  if (convertToUserName(this, student) !== 'dumbledore') {
    this.db.get('SELECT * FROM students WHERE user_id = ?', student, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record != undefined) {
        botCommand.announcePlainString(originalMessage, record.username + ' belongs to ' + record.house.capitalizeFirstLetter() + ' House, they have: \n earned: ' + record.points_earned + ' points \n taken: ' + record.points_taken + ' points \n given: ' + record.points_given + ' points \n' + 'I\'m sure if you asked them in person they would tell you all this information themself. Good day.', this);
      } else {
        botCommand.announcePlainString(originalMessage, 'I am unfamiliar with that student. In all my years I have never come across such a person. However, if they are over the age of 11 and possess magical abilities, I invite them to come to Hogwarts. Perhaps they are a muggle, or worse a Squib.', this);
      }
    });
  } else {
    botCommand.announcePlainString(originalMessage, 'Well my name is Albus Percival Wulfric Brian Dumbledore, I am Headmaster of Hogwarts, I am famous for discovering the 12 uses of Dragon\'s blood, and my favorite candy is Lemon Drops.', this);
  }
}

function bestStudent(originalMessage) {
  for (let house of Object.values(HOUSE)) {
    this.db.get('SELECT * FROM students WHERE house = ? ORDER BY points_earned DESC', house, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record !== undefined) {
        botCommand.announcePlainString(originalMessage, 'The head boy/girl of ' + record.house.capitalizeFirstLetter() + ' is @' + record.username + ' with ' + record.points_earned + ' points!', this);
      }
    });
  } 
  botCommand.announcePlainString(originalMessage, '\n I think they\'ve earned some Chocolate Frogs.', this);
}

function worstStudent(originalMessage) {
  for (let house of Object.values(HOUSE)) {
    this.db.get('SELECT * FROM students WHERE house = ? ORDER BY points_taken DESC', house, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record !== undefined) {
        botCommand.announcePlainString(originalMessage, 'The student most likely to join the Inquisitorial Squad in ' + record.house.capitalizeFirstLetter() + ' is @' + record.username + ' who has taken a total of ' + record.points_taken + ' from their fellow students.', this);
      }
    });
  }
}

function getAllStudents(originalMessage) {
  this.db.all('SELECT * FROM students', (err, record) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    for (let house of Object.values(HOUSE)) {
      getAllStudentsFromHouse.call(this, originalMessage, house);
    };
  });
}

function getAllStudentsFromHouse(originalMessage, house) {
  this.db.all('SELECT * FROM students WHERE house = ? ', house, (err, record) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    let students = 'The students of ' + house.capitalizeFirstLetter() + ' House are:\n';
    for (let name of record) {
      students = students + name.username + '\n';
    }
    botCommand.announcePlainString(originalMessage, students, this);
  });
}

function explainSorting(originalMessage) {
  botCommand.announcePlainString(originalMessage, 'Students you have two choices for sorting. If you wish to choose your house you need only ask \`Professor can I please join Gryffindor\` For those more daring, you can let the Hat of Godric Gryffindor decide. Just say \`Professor I would like to put my fate in the hands of the Sorting Hat\` \n Good luck, let the sorting begin.', this);
}

function saveGitName(originalMessage) {
  const gitName = originalMessage.text.split('=')[1];
  const user = originalMessage.user;
  this.db.run('UPDATE students SET github_name = ? WHERE user_id = ?', gitName, user, (err, respond) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    botCommand.announcePlainString(originalMessage, convertToUserName(this, user) + '\'s github name is saved as ' + gitName, this);
  });
}

async function forceSortRemaining(originalMessage) {
  const users = await this.getUsers();

  for (let user of users.members) {
    originalMessage.user = user.id;
    rollTheDice.call(this, originalMessage);
  };
}

//Slacks API converts an @username reference in a message to the userid this converts it back to username.
function convertToUserName(bot, key) {
  for (let userid of bot.users) {
    if (userid.id == key || userid.name == key) {
      return userid.name;
    }
  }
}

module.exports = replyWithDumbledore;