
module.exports = {
  INPUT: {
    POINTS_TO: {
      CALL: 'points to'
    },
    POINTS_FROM: {
      CALL: 'points from'
    },
    PROFESSOR: {
      CALL: 'professor',
      GET_BEST_STUDENT: 'best student',
      GET_MEANEST_STUDENT: 'meanest student',
      TELL_ME_ABOUT: {
        CALL: 'tell me about',
        JASON_MOM: 'jason\'s mom',
      },
      SAVE_GIT_NAME: 'link my github name='
    },
    HELP: {
      CALL: 'help'
    }
  },
  OUTPUT: {
    pointTo: result => 'Congratulations ' + result.username + 'has ' + result.point + ' points!',
    pointFrom: (result) => 'Alas house now only has ' + result.point + ' points. Do not dwell on your misdeeds, there is potential for greatness in all students!',
    SAY_HELLO: 'Welcome to Hogwarts everyone!\n Now, in a few moments you will pass through these doors and join your classmates, but before you take your seats, you must be sorted into your houses. They are Gryffindor, Hufflepuff, Ravenclaw, and Slytherin. Now while you\'re here, your house will be like your family. Your triumphs will earn you points. Any rule breaking, and you will lose points. At the end of the year, the house with the most points is awarded the house cup.\n I Albus Dumbledore will award points on your behalf. Just say `10 points to Gryffindor` + or `5 points to @benc` to award points',
    getBestStudent: record => 'High score (boy/girl): ' + record.username + ' with ' + record.point + ' points!',
    getMeanestStudent: record => 'Low score (boy/girl): ' + record.username + ' with ' + record.point + ' points!',
    TELL_ME_ABOUT: {
      PERSON: {
        DUMBLEDORE: 'Well my name is Albus Percival Wulfric Brian Dumbledore, I am Headmaster of Hogwarts, I am famous for discovering the 12 uses of Dragon\'s blood, and my favorite candy is Lemon Drops.',
        student: record => record.username + 'they have: ' + record.point + ' points \nI\'m sure if you asked them in person they would tell you all this information themself. Good day.',
        NOT_FOUND: 'I am unfamiliar with that student. In all my years I have never come across such a person. However, if they are over the age of 11 and possess magical abilities, I invite them to come to Hogwarts. Perhaps they are a muggle, or worse a Squib.'
      },
      JASON_MOM: 'Not much is known about Jason\'s mom, except that she is thought to be responsible for the great internet unplugging of 2016',
    },
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
      POINT: 'point',
      GITHUB_NAME: 'gitName'
    },
    BOT: {
      CALL: 'Bot',
      BOT_API_KEY: 'botApi',
      BOT_NAME: 'botName'
    }
  }
};
