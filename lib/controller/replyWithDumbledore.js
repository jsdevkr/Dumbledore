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
    _getAllHouseScores(originalMessage, this, botCommand.getAllHousePointsCallback);
  } else if (originalMessage.text.toLowerCase().indexOf('reset the scores please') > -1) {
    _resetTheScores(originalMessage, this, botCommand.announcePlainString);
  } else if (originalMessage.text.toLowerCase().indexOf('say hello to the students') > -1) {
    _welcomeMessageManual(originalMessage, this);
  } else if (originalMessage.text.toLowerCase().indexOf('can i please join') > -1) {
    _addStudentToHouse(originalMessage, null, this, null /*self._studentJoinedHouse*/);
  } else if (originalMessage.text.toLowerCase().indexOf('i would like to put my fate in the hands of the sorting hat') > -1) {
    _rollTheDice(originalMessage, this);
  } else if ((originalMessage.text.toLowerCase().indexOf('obliviate') > -1) && (originalMessage.text.toLowerCase().indexOf('@') > -1)) {
    _obliviate(originalMessage, this);
  } else if (originalMessage.text.toLowerCase().indexOf('best student') > -1) {
    _bestStudent(originalMessage, this);
  } else if (originalMessage.text.toLowerCase().indexOf('meanest student') > -1) {
    _worstStudent(originalMessage, this);
  } else if ((originalMessage.text.toLowerCase().indexOf('tell me about') > -1) && (originalMessage.text.toLowerCase().indexOf('@') > -1)) {
    _studentStats(originalMessage, this);
  } else if ((originalMessage.text.toLowerCase().indexOf('tell me about') > -1) && (house != undefined)) {
    _getAllStudentsFromHouse(originalMessage, house, this);
  } else if ((originalMessage.text.toLowerCase().indexOf('tell me about') > -1) && (originalMessage.text.toLowerCase().indexOf('jason\'s mom') > -1)) {
    botCommand.announcePlainString(originalMessage, 'Not much is known about Jason\'s mom, except that she is thought to be responsible for the great internet unplugging of 2016', self);
  } else if (originalMessage.text.toLowerCase().indexOf('start the sorting ceremony') > -1) {
    _explainSorting(originalMessage, this);
  } else if (originalMessage.text.toLowerCase().indexOf('hogwarts roster') > -1) {
    _getAllStudents(originalMessage, this);
  } else if (originalMessage.text.toLowerCase().indexOf('link my github name=') > -1) {
    _saveGitName(originalMessage, this);
  } else if (originalMessage.text.toLowerCase().indexOf('sort the rest') > -1) {
    _forceSortRemaining(originalMessage, this);
  }
}

async function _getAllHouseScores(originalMessage, bot, callback) {
  const channel = await bot.getChannelById(originalMessage.channel);

  bot.postMessageToChannel(channel.name, 'The House Points are: \n', { as_user: true }, function () {
    getPointsFromDatabase(originalMessage, "gryffindor", bot, callback);
    getPointsFromDatabase(originalMessage, "hufflepuff", bot, callback);
    getPointsFromDatabase(originalMessage, "ravenclaw", bot, callback);
    getPointsFromDatabase(originalMessage, "slytherin", bot, callback);
  });
};

function _resetTheScores(originalMessage, bot, callback) {
  var bot = bot;
  global.db.run('UPDATE houses SET points = 0');
  callback(originalMessage, "The scores have been reset and we are ready for another great year at Hogwarts!", bot);
}

function _welcomeMessageManual(originalMessage, bot) {
  var bot = bot;
  botCommand.announcePlainString(originalMessage, 'Welcome to Hogwarts everyone!' +
    '\n Now, in a few moments you will pass through these doors and join your classmates, but before you take your seats, you must be sorted into your houses. They are Gryffindor, Hufflepuff, Ravenclaw, and Slytherin. Now while you\'re here, your house will be like your family. Your triumphs will earn you points. Any rule breaking, and you will lose points. At the end of the year, the house with the most points is awarded the house cup.' + '\n I Albus Dumbledore will award points on your behalf. Just say `10 points to Gryffindor` + or `5 points to @benc` to award points', bot);
}

function _addStudentToHouse(originalMessage, house, bot, callback) {
  var bot = bot;
  //var student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  var student = originalMessage.user;
  var studentUsername = bot.convertToUserName(bot, student);
  var notAlreadyStudent = true;
  global.db.all('SELECT * FROM students', function (err, respond) {
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
        global.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "gryffindor")', student, studentUsername, function (err, respond) {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          bot._greetNewStudent(originalMessage, studentUsername, 'gryffindor', bot);
        });
      } else if ((originalMessage.text.toLowerCase().indexOf('hufflepuff') > -1) || house == 'hufflepuff') {
        global.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "hufflepuff")', student, studentUsername, function (err, respond) {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          bot._greetNewStudent(originalMessage, studentUsername, 'hufflepuff', bot);
        });
      } else if ((originalMessage.text.toLowerCase().indexOf('ravenclaw') > -1) || house == 'ravenclaw') {
        global.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "ravenclaw")', student, studentUsername, function (err, respond) {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          bot._greetNewStudent(originalMessage, studentUsername, 'ravenclaw', bot);
        });
      } else if ((originalMessage.text.toLowerCase().indexOf('slytherin') > -1) || house == 'slytherin') {
        global.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "slytherin")', student, studentUsername, function (err, respond) {
          if (err) {
            return console.error('DATABASE ERROR', err);
          }
          bot._greetNewStudent(originalMessage, studentUsername, 'slytherin', bot);
        });
      }
    }
  });
}

function _greetNewStudent(originalMessage, student, house, bot) {
  var bot = bot;
  botCommand.announcePlainString(originalMessage, 'Welcome ' + student.capitalizeFirstLetter() + ' the house of ' + house.capitalizeFirstLetter() + ' expects great things from you!', bot);
}

function _rollTheDice(originalMessage, bot) {
  var house = random.integer(0, 3);
  switch (house) {
    case 0:
      bot._addStudentToHouse(originalMessage, 'gryffindor', bot, null);
      break;
    case 1:
      bot._addStudentToHouse(originalMessage, 'hufflepuff', bot, null);
      break;
    case 2:
      bot._addStudentToHouse(originalMessage, 'ravenclaw', bot, null);
      break;
    case 3:
      bot._addStudentToHouse(originalMessage, 'slytherin', bot, null);
      break;
  };
}

function _obliviate(originalMessage, bot) {
  var student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  if (student === originalMessage.user) {
    global.db.run('DELETE FROM students WHERE user_id = ?', student, function (err, record) {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      botCommand.announcePlainString(originalMessage, 'Poof, even a remembrall wont help you now Gilderoy', bot);
    });
  }
}

function _studentStats(originalMessage, bot) {
  var student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  if (bot.convertToUserName(bot, student) !== 'dumbledore') {
    global.db.get('SELECT * FROM students WHERE user_id = ?', student, function (err, record) {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record != undefined) {
        botCommand.announcePlainString(originalMessage, record.username + ' belongs to ' + record.house.capitalizeFirstLetter() + ' House, they have: \n earned: ' + record.points_earned + ' points \n taken: ' + record.points_taken + ' points \n given: ' + record.points_given + ' points \n' + 'I\'m sure if you asked them in person they would tell you all this information themself. Good day.', bot);
      } else {
        botCommand.announcePlainString(originalMessage, 'I am unfamiliar with that student. In all my years I have never come across such a person. However, if they are over the age of 11 and possess magical abilities, I invite them to come to Hogwarts. Perhaps they are a muggle, or worse a Squib.', bot);
      }
    });
  } else {
    botCommand.announcePlainString(originalMessage, 'Well my name is Albus Percival Wulfric Brian Dumbledore, I am Headmaster of Hogwarts, I am famous for discovering the 12 uses of Dragon\'s blood, and my favorite candy is Lemon Drops.', bot);
  }
}

function _bestStudent(originalMessage, bot) {
  for (var house of ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']) {
    global.db.get('SELECT * FROM students WHERE house = ? ORDER BY points_earned DESC', house, function (err, record) {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record !== undefined) {
        botCommand.announcePlainString(originalMessage, 'The head boy/girl of ' + record.house.capitalizeFirstLetter() + ' is @' + record.username + ' with ' + record.points_earned + ' points!', bot);
      }
    });
  } botCommand.announcePlainString(originalMessage, '\n I think they\'ve earned some Chocolate Frogs.', bot);
}

function _worstStudent(originalMessage, bot) {
  for (var house of ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']) {
    global.db.get('SELECT * FROM students WHERE house = ? ORDER BY points_taken DESC', house, function (err, record) {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (record !== undefined) {
        botCommand.announcePlainString(originalMessage, 'The student most likely to join the Inquisitorial Squad in ' + record.house.capitalizeFirstLetter() + ' is @' + record.username + ' who has taken a total of ' + record.points_taken + ' from their fellow students.', bot);
      }
    });
  }
}

function _getAllStudents(originalMessage, bot) {
  global.db.all('SELECT * FROM students', function (err, record) {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    for (var house of ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']) {
      bot._getAllStudentsFromHouse(originalMessage, house, bot);
    };
  });
}

function _getAllStudentsFromHouse(originalMessage, house, bot) {
  global.db.all('SELECT * FROM students WHERE house = ? ', house, function (err, record) {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    var students = 'The students of ' + house.capitalizeFirstLetter() + ' House are:\n';
    for (var name of record) {
      students = students + name.username + '\n';
    }
    botCommand.announcePlainString(originalMessage, students, bot);
  });
}

function _explainSorting(originalMessage, bot) {
  botCommand.announcePlainString(originalMessage, 'Students you have two choices for sorting. If you wish to choose your house you need only ask \`Professor can I please join Gryffindor\` For those more daring, you can let the Hat of Godric Gryffindor decide. Just say \`Professor I would like to put my fate in the hands of the Sorting Hat\` \n Good luck, let the sorting begin.', bot);
}

function _saveGitName(originalMessage, bot) {
  var gitName = originalMessage.text.split('=')[1];
  var user = originalMessage.user;
  global.db.run('UPDATE students SET github_name = ? WHERE user_id = ?', gitName, user, function (err, respond) {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    botCommand.announcePlainString(originalMessage, bot.convertToUserName(bot, user) + '\'s github name is saved as ' + gitName, bot);
  });
}

function _forceSortRemaining(originalMessage, bot) {
  for (var userid of bot.users) {
    originalMessage.user = userid.id;
    (function (msg, bt) {
      bt._rollTheDice(msg, bt);
    })(originalMessage, bot);
  };
}

//Slacks API converts an @username reference in a message to the userid this converts it back to username.
function convertToUserName(bot, key) {
    var bot = bot;
    for (var userid of bot.users) {
      if (userid.id == key || userid.name == key) {
        return userid.name;
      }
    }
  }
module.exports = replyWithDumbledore;