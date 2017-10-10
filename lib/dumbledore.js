const path = require('path');
const fs = require('fs');
<<<<<<< HEAD
const SQLite = require("sqlite3").verbose();// sqlite를 연결하는 객체를 만듭니다.
const Bot = require("slackbots");
const random = require("random-js")(); // uses the nativeMath engine
const cron = require('cron').CronJob; // cron works
=======
const SQLite = require('sqlite3').verbose();
const Bot = require('slackbots');
// const random = require('random-js')(); // uses the nativeMath engine
const Cron = require('cron').CronJob; // cron works
const parseMessage = require('./parseMessage');
const { OUTPUT } = require('./word');
>>>>>>> young/master

class Dumbledore extends Bot { //const Bot를 상속받음
  constructor(settings) { //settings구성 ?
    settings.token = settings.token || 'your-token'; //'xoxb-248266143441-zgzDCId1tMbBG7GKaToXsUi2';
    settings.name = settings.name || 'your-bot-name'; //'bot1';

    super(settings);//bot생성자 

    this.githubChannel = settings.githubChannel || 'null';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'dumbledore.db');
    this.db = null;
    this.user = null;
    this.params = {
      link_names: 1
    };
  }
  
  run() {
<<<<<<< HEAD
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
  }//실행 메소드
=======
    return new Promise((resolve) => {
      this.on('start', () => {
        this._onStart();
        resolve();
      });
      this.on('message', this._onMessage);
    });
  }
>>>>>>> young/master

  _onStart() {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
    // this._onCron();
  }

  _onCron() {
    const cronMessage = {
      type: 'message',
      channel: 'your-channel-id',
      text: `${this.name} who is winning the house cup`
    };

<<<<<<< HEAD
    new cron({
      cronTime: '00 59 23 * * 0',//초 분 시간 년 월 일
      onTick: () => self._getAllHouseScores(cronMessage, self, self._getAllHousePointsCallback),
=======
    new Cron({
      cronTime: '00 59 23 * * 0',
      onTick: () => this._getAllHouseScores(cronMessage, this, this._getAllHousePointsCallback),
>>>>>>> young/master
      start: false,
      timeZone: 'Asia/Seoul'
    }).start();
  }

  _loadBotUser() {
    [this.user] = this.users.filter((user) => {
      return user.name === this.name;
    });
  }

  _connectDb() {
    if (!fs.existsSync(this.dbPath)) {
      console.error('Database path "' + this.dbPath + '" does not exists or it\'s not readable.');
      process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
  }

  _firstRunCheck() {
    this.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', (err, record) => {
      const currentTime = (new Date()).toJSON();

      if (err) {
        return console.error('DATABASE ERROR:', err);
      }

      // this is a first run
      if (!record) {
        this._welcomeMessage();
        return this.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
      }

      // updates with new last running time
      this.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
  }

  _welcomeMessage() {
    this.postMessageToChannel(this.channels[0].name, OUTPUT.SAY_HELLO, { as_user: true });
  }

  _onMessage(message) {
    if (this._isTargetEvent(message)) {
      if ((message.text.indexOf('01100100 01110101 01101101 01100010 01101100 01100101 01100100 01101111 01110010 01100101') > -1) || (message.text.indexOf('01110000 01101111 01101001 01101110 01110100 01110011 00100000 01110100 01101111') > -1) || (message.text.indexOf('01110000 01101111 01101001 01101110 01110100 01110011 00100000 01100110 01110010 01101111 01101101') > -1)) {
        const binaryArray = message.text.split(' ');
        const decimalArray = binaryArray.map(function (x) { return parseInt(x, 2); });
        let finalString = String.fromCharCode.apply(this, decimalArray);
        if (finalString.indexOf('@') > -1) {
          const username = finalString.substring(finalString.indexOf('@') + 1).split(' ')[0];
          const userid = this.convertToUserID(username);
          finalString = finalString.replace('@' + username, '<@' + userid + '>');
        }
        message.text = finalString;
      }
      parseMessage.call(this, message);
    }
  }

  _isTargetEvent(message) {
    const isChatMessage = message.type === 'message' && (Boolean(message.text) || Boolean(message.attachments));
    const isChannelConversation = typeof message.channel === 'string' && message.channel[0] === 'C';
    const isFromDumbledore = message.user === this.user.id;
    const isFromSlackbot = message.user === 'USLACKBOT';

    return isChatMessage && isChannelConversation && !isFromDumbledore && !isFromSlackbot;
  }

  convertToUserID(key) {
    if (key in this.users) {
      return key;
    }
<<<<<<< HEAD
  }

  _getAllStudents(originalMessage, bot) {
    bot.db.all('SELECT * FROM students', function (err, record) {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      for (var house of ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']) {
        bot._getAllStudentsFromHouse(originalMessage, house, bot);
      };
    });
  }

  _getAllStudentsFromHouse(originalMessage, house, bot) {
    bot.db.all('SELECT * FROM students WHERE house = ? ', house, function(err, record) {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      var students = 'The students of ' + house.capitalizeFirstLetter() + ' House are:\n';
      for (var name of record) {
        students = students + name.username + '\n';
      }
      bot._announcePlainString(originalMessage, students, bot);
    });
  }

  _getAllHouseScores(originalMessage, bot, callback) {
    bot.postMessageToChannel(bot._getChannelById(originalMessage.channel).name, 'The House Points are: \n', {as_user: true}, function() {
    bot._getPointsFromDatabase(originalMessage, "gryffindor", bot, callback);
    bot._getPointsFromDatabase(originalMessage, "hufflepuff", bot, callback);
    bot._getPointsFromDatabase(originalMessage, "ravenclaw", bot, callback);
    bot._getPointsFromDatabase(originalMessage, "slytherin", bot, callback);
    });
  };

  _rollTheDice(originalMessage, bot) {
    
    var house = random.integer(0,3);
    switch(house) {
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

  _addStudentToHouse(originalMessage, house, bot, callback) {
    var bot = bot;
    //var student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
    var student = originalMessage.user;
    var studentUsername = bot.convertToUserName(bot, student);
    var notAlreadyStudent = true;
    bot.db.all('SELECT * FROM students', function (err, respond) {
      if (err) {
        return console.error('DATABASE ERROR', err);
      }
      if (respond !== undefined) {
        for (var db_user of respond) {
          if (db_user.user_id == student) {
      // bot._announcePlainString(originalMessage, studentUsername + ' You are already in a house. Once You have been sorted in that house you shall remain. But fear not, if you give it a chance you will see there is much to gain.', bot);
          notAlreadyStudent = false;
          break;
    }
        }
      }
      if (notAlreadyStudent === true) {
    if ((originalMessage.text.toLowerCase().indexOf('gryffindor') > -1) || house == 'gryffindor') {
      bot.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "gryffindor")', student, studentUsername, function (err, respond) {
        if (err) {
          return console.error('DATABASE ERROR', err);
        }
        bot._greetNewStudent(originalMessage, studentUsername, 'gryffindor', bot);
      });
    } else if ((originalMessage.text.toLowerCase().indexOf('hufflepuff') > -1) || house == 'hufflepuff') {
      bot.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "hufflepuff")', student, studentUsername, function (err, respond) {
        if (err) {
          return console.error('DATABASE ERROR', err);
        }
        bot._greetNewStudent(originalMessage, studentUsername, 'hufflepuff', bot);
      });
    } else if ((originalMessage.text.toLowerCase().indexOf('ravenclaw') > -1) || house == 'ravenclaw') {
      bot.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "ravenclaw")', student, studentUsername, function (err, respond) {
        if (err) {
          return console.error('DATABASE ERROR', err);
        }
        bot._greetNewStudent(originalMessage, studentUsername, 'ravenclaw', bot);
      });
    } else if ((originalMessage.text.toLowerCase().indexOf('slytherin') > -1) || house == 'slytherin') {
      bot.db.run('INSERT INTO students (user_id, username, house) VALUES (?, ?, "slytherin")', student, studentUsername, function (err, respond) {
        if (err) {
          return console.error('DATABASE ERROR', err);
        }
        bot._greetNewStudent(originalMessage, studentUsername, 'slytherin', bot);
      });
    }
      }
    });
  }

  _greetNewStudent(originalMessage, student, house, bot) {
    var bot = bot;
    bot._announcePlainString(originalMessage, 'Welcome ' + student.capitalizeFirstLetter() + ' the house of ' + house.capitalizeFirstLetter() + ' expects great things from you!', bot);
  }

  //Slacks API converts an @username reference in a message to the userid this converts it back to username.
  convertToUserName(bot, key) {
    var bot = bot;
    for (var userid of bot.users) {
      if (userid.id == key || userid.name == key) {
        return userid.name;
      }
    }
  }

  convertToUserID(bot, key) {
    if (key in bot.users) {
      return key
    }
    for (var userid of bot.users) {
      if (userid.name == key) {
=======
    return this.users.find((userid) => {
      if (userid.name === key) {
>>>>>>> young/master
        return userid.id;
      }
      return false;
    });
  }
}

module.exports = Dumbledore;
