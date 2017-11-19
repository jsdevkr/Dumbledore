
module.exports = {
  INPUT: {
    POINTS_TO: {
      CALL: 'points to'
    },
    PROFESSOR: {
      CALL: 'professor',
      GET_BEST_STUDENT: 'best student',
      GET_WORST_STUDENT: 'worst student',
      GET_LIST_STUDENT: 'list student score',
      TELL_ME_ABOUT: {
        CALL: 'tell me about',
        JASON_MOM: 'jason\'s mom',
      }
    },
    HELP: {
      CALL: 'help'
    }
  },
  OUTPUT: {
    reaction: (result, point, user, reaction) => ':tada: Congratulations ' + result.userName + ' get ' + point + ' points by :' + reaction + ': from ' + user + ' !',
    pointTo: (result, point, user) => ':confetti_ball: Congratulations ' + result.userName + ' get ' + point + ' points from ' + user + ' !',
    reactionCancel: (result, point, user, reaction) => 'Oh... ' + user + ' canceled :' + reaction + ': so Mr.dumbledore take ' + point + ' from ' + result.userName + '.. You have to give the correct answer. :joy:',
    SAY_HELLO: 'Welcome to Hogwarts everyone!\n Now, in a few moments you will pass through these doors and join your classmates. Your triumphs will earn you points. Any rule breaking, and you will lose points. I Albus Dumbledore will award points on your behalf. Just say `5 points to @benc` to award points. If you want to know the best student, just say `professor best student`. Then good luck everyone!',
    getBestStudent: record => ':thinking_face: High score (boy/girl): ' + record.userName + ' with ' + record.point + ' points!',
    getWorstStudent: record => ':fearful: Low score (boy/girl): ' + record.userName + ' with ' + record.point + ' points!',
    getListStudent: (record) => {
      let grade = 0;
      let rank = '';
      let students = ':school: The scores of Hogwarts student\'s are: \n\n';
      record.forEach(function (student) {
        grade++;
        if (grade === 1) {
          rank = ':one:';
        } else if (grade === 2) {
          rank = ':two:';
        } else if (grade === 3) {
          rank = ':three:';
        } else {
          rank = ':arrow_right:';
        }
        const stu = rank + ' [' + student.attributes.userName + '] ' + student.attributes.point + ' point';
        students += stu + '\n';
      });
      return students;
    },
    TELL_ME_ABOUT: {
      PERSON: {
        DUMBLEDORE: 'Well my name is Albus Percival Wulfric Brian Dumbledore, I am Headmaster of Hogwarts, I am famous for discovering the 12 uses of Dragon\'s blood, and my favorite candy is Lemon Drops.',
        student: record => record.userName + ' have: ' + record.point + ' points \nI\'m sure if you asked them in person they would tell you all information themself. Good day.',
        NOT_FOUND: 'I am unfamiliar with that student. In all my years I have never come across such a person. However, if they are over the age of 11 and possess magical abilities, I invite them to come to Hogwarts. Perhaps they are a muggle, or worse a Squib.'
      },
      JASON_MOM: 'Not much is known about Jason\'s mom, except that she is thought to be responsible for the great internet unplugging of 2016',
    },
    WHENZERO: 'Hmm... You don\'t have your own points. before giving points to someone, you should answer to other\'s question and get extra points.',
    cancelWhenzero: (result) => 'Oh... reaction was canceled... but Mr.dumbledore didn\'t take point from ' + result.userName + ' because ' + result.userName + ' don\'t have point.. :joy:',
    FAIL_POINT_TO: 'Well... you can\'t award points to me, the professor.'
  },
  DB: {
    INFO: {
      CALL: 'Info',
      LASTRUN: 'lastrun'
    },
    STUDENT: {
      CALL: 'Student',
      BOT_ID: 'botId',
      USER_ID: 'userId',
      USER_NAME: 'userName',
      POINT: 'point',
      GITHUB_NAME: 'gitName'
    },
    BOT: {
      CALL: 'Bot',
      BOT_API_KEY: 'botApi',
      BOT_NAME: 'botName',
    },
    MESSAGE: {
      CALL: 'Message',
      BOT_ID: 'botId',
      USER_ID: 'userId',
      OP: 'op',
      AMOUNT: 'amount',
    },
  }
};
