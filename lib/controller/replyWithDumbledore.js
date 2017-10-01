const random = require("random-js")(); // uses the nativeMath engine
const getPointsFromDatabase = require('../helper/getPointsFromDatabase');
const botCommand = require('../helper/botCommand');

function replyWithDumbledore(originalMessage) {
  let house;

  for (var h of ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']) {
    if (originalMessage.text.toLowerCase().indexOf(h) > -1) {
      house = h;
    }
  }

  if (originalMessage.text.toLowerCase().indexOf('who is winning the house cup') > -1) {
    _getAllHouseScores.call(this, originalMessage, botCommand.getAllHousePointsCallback);
  } else if (originalMessage.text.toLowerCase().indexOf('reset the scores please') > -1) {
    _resetTheScores.call(this, botCommand.announcePlainString);
  } else if (originalMessage.text.toLowerCase().indexOf('say hello to the students') > -1) {
    _welcomeMessageManual.call(this, originalMessage);
  } else if (originalMessage.text.toLowerCase().indexOf('can i please join') > -1) {
    _addStudentToHouse.call(this, originalMessage, null, null /*self._studentJoinedHouse*/);
  } else if (originalMessage.text.toLowerCase().indexOf('i would like to put my fate in the hands of the sorting hat') > -1) {
    _rollTheDice.call(this, originalMessage);
  } else if ((originalMessage.text.toLowerCase().indexOf('obliviate') > -1) && (originalMessage.text.toLowerCase().indexOf('@') > -1)) {
    _obliviate.call(this, originalMessage);
  } else if (originalMessage.text.toLowerCase().indexOf('best student') > -1) {
    _bestStudent.call(this, originalMessage);
  } else if (originalMessage.text.toLowerCase().indexOf('meanest student') > -1) {
    _worstStudent.call(this, originalMessage);
  } else if ((originalMessage.text.toLowerCase().indexOf('tell me about') > -1) && (originalMessage.text.toLowerCase().indexOf('@') > -1)) {
    _studentStats.call(this, originalMessage);
  } else if ((originalMessage.text.toLowerCase().indexOf('tell me about') > -1) && (house != undefined)) {
    _getAllStudentsFromHouse.call(this, originalMessage, house);
  } else if ((originalMessage.text.toLowerCase().indexOf('tell me about') > -1) && (originalMessage.text.toLowerCase().indexOf('jason\'s mom') > -1)) {
    botCommand.announcePlainString(originalMessage, 'Not much is known about Jason\'s mom, except that she is thought to be responsible for the great internet unplugging of 2016', this);
  } else if (originalMessage.text.toLowerCase().indexOf('start the sorting ceremony') > -1) {
    _explainSorting.call(this, originalMessage);
  } else if (originalMessage.text.toLowerCase().indexOf('hogwarts roster') > -1) {
    _getAllStudents.call(this, originalMessage);
  } else if (originalMessage.text.toLowerCase().indexOf('link my github name=') > -1) {
    _saveGitName.call(this, originalMessage);
  } else if (originalMessage.text.toLowerCase().indexOf('sort the rest') > -1) {
    _forceSortRemaining.call(this, originalMessage);
  }
}

async function _getAllHouseScores(originalMessage, callback) {
  const channel = await this.getChannelById(originalMessage.channel);

  this.postMessageToChannel(channel.name, 'The House Points are: \n', { as_user: true }, () => {
    getPointsFromDatabase(originalMessage, "gryffindor", this, callback);
    getPointsFromDatabase(originalMessage, "hufflepuff", this, callback);
    getPointsFromDatabase(originalMessage, "ravenclaw", this, callback);
    getPointsFromDatabase(originalMessage, "slytherin", this, callback);
  });
};

function _resetTheScores(originalMessage, callback) {
  this.db.run('UPDATE houses SET points = 0');
  callback(originalMessage, "The scores have been reset and we are ready for another great year at Hogwarts!", this);
}

function _welcomeMessageManual(originalMessage) {
  botCommand.announcePlainString(originalMessage, 'Welcome to Hogwarts everyone!' +
    '\n Now, in a few moments you will pass through these doors and join your classmates, but before you take your seats, you must be sorted into your houses. They are Gryffindor, Hufflepuff, Ravenclaw, and Slytherin. Now while you\'re here, your house will be like your family. Your triumphs will earn you points. Any rule breaking, and you will lose points. At the end of the year, the house with the most points is awarded the house cup.' + '\n I Albus Dumbledore will award points on your behalf. Just say `10 points to Gryffindor` + or `5 points to @benc` to award points', this);
}

function _addStudentToHouse(originalMessage, house, callback) {
  //var student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  var student = originalMessage.user;
  var studentUsername = convertToUserName(this, student);
  var notAlreadyStudent = true;
  this.db.all('SELECT * FROM students', (err, respond) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    if (respond !== undefined) {
      for (var db_user of respond) {
        if (db_user.user_id == student) {
          // botCommand.announcePlainString(originalMessage, studentUsername + ' You are already in a house. Once You have been sorted in that house you shall remain. But fear not, if you give it a chance you will see there is much to gain.', bot);
          notAlreadyStudent = false;
          break;
        }
      }
    }
    if (notAlreadyStudent === true) {
      if ((originalMessage.text.toLowerCase().indexOf('gryffindor') > -1) || house == 'gryffindor') {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "gryffindor")', student, studentUsername, (err, respond) => {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          _greetNewStudent.call(this, originalMessage, studentUsername, 'gryffindor');
        });
      } else if ((originalMessage.text.toLowerCase().indexOf('hufflepuff') > -1) || house == 'hufflepuff') {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "hufflepuff")', student, studentUsername, (err, respond) => {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          _greetNewStudent.call(this, originalMessage, studentUsername, 'hufflepuff');
        });
      } else if ((originalMessage.text.toLowerCase().indexOf('ravenclaw') > -1) || house == 'ravenclaw') {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "ravenclaw")', student, studentUsername, (err, respond) => {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          _greetNewStudent.call(this, originalMessage, studentUsername, 'ravenclaw');
        });
      } else if ((originalMessage.text.toLowerCase().indexOf('slytherin') > -1) || house == 'slytherin') {
        this.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "slytherin")', student, studentUsername, (err, respond) => {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          _greetNewStudent.call(this, originalMessage, studentUsername, 'slytherin') ;
        });
      }
    }
  });
}

function _greetNewStudent(originalMessage, student, house) {
  botCommand.announcePlainString(originalMessage, 'Welcome ' + student.capitalizeFirstLetter() + ' the house of ' + house.capitalizeFirstLetter() + ' expects great things from you!', this);
}

function _rollTheDice(originalMessage) {
  var house = random.integer(0, 3);
  switch (house) {
    case 0:
      _addStudentToHouse.call(this, originalMessage, 'gryffindor', null);
      break;
    case 1:
      _addStudentToHouse.call(this, originalMessage, 'hufflepuff', null);
      break;
    case 2:
      _addStudentToHouse.call(this, originalMessage, 'ravenclaw', null);
      break;
    case 3:
      _addStudentToHouse.call(this, originalMessage, 'slytherin', null);
      break;
  };
}

function _obliviate(originalMessage) {
  var student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  if (student === originalMessage.user) {
    this.db.run('DELETE FROM students WHERE user_id = ?', student, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      botCommand.announcePlainString(originalMessage, 'Poof, even a remembrall wont help you now Gilderoy', this);
    });
  }
}

function _studentStats(originalMessage) {
  var student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
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

function _bestStudent(originalMessage) {
  for (var house of ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']) {
    this.db.get('SELECT * FROM students WHERE house = ? ORDER BY points_earned DESC', house, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record !== undefined) {
        botCommand.announcePlainString(originalMessage, 'The head boy/girl of ' + record.house.capitalizeFirstLetter() + ' is @' + record.username + ' with ' + record.points_earned + ' points!', this);
      }
    });
  } botCommand.announcePlainString(originalMessage, '\n I think they\'ve earned some Chocolate Frogs.', this);
}

function _worstStudent(originalMessage) {
  for (var house of ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']) {
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

function _getAllStudents(originalMessage) {
  this.db.all('SELECT * FROM students', (err, record) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    for (var house of ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']) {
      _getAllStudentsFromHouse.call(this, originalMessage, house);
    };
  });
}

function _getAllStudentsFromHouse(originalMessage, house) {
  this.db.all('SELECT * FROM students WHERE house = ? ', house, (err, record) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    var students = 'The students of ' + house.capitalizeFirstLetter() + ' House are:\n';
    for (var name of record) {
      students = students + name.username + '\n';
    }
    botCommand.announcePlainString(originalMessage, students, this);
  });
}

function _explainSorting(originalMessage) {
  botCommand.announcePlainString(originalMessage, 'Students you have two choices for sorting. If you wish to choose your house you need only ask \`Professor can I please join Gryffindor\` For those more daring, you can let the Hat of Godric Gryffindor decide. Just say \`Professor I would like to put my fate in the hands of the Sorting Hat\` \n Good luck, let the sorting begin.', this);
}

function _saveGitName(originalMessage) {
  var gitName = originalMessage.text.split('=')[1];
  var user = originalMessage.user;
  this.db.run('UPDATE students SET github_name = ? WHERE user_id = ?', gitName, user, (err, respond) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    botCommand.announcePlainString(originalMessage, convertToUserName(this, user) + '\'s github name is saved as ' + gitName, this);
  });
}

function _forceSortRemaining(originalMessage) {
  for (var userid of this.users) {
    originalMessage.user = userid.id;
    (msg => {
      _rollTheDice.call(this, msg);
    })(originalMessage);
  };
}

//Slacks API converts an @username reference in a message to the userid this converts it back to username.
function convertToUserName(bot, key) {
    for (var userid of bot.users) {
      if (userid.id == key || userid.name == key) {
        return userid.name;
      }
    }
  }
module.exports = replyWithDumbledore;