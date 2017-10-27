const { capitalizeFirstLetter } = require('./helper/stringHandler');

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
      GET_WINNER: 'who is winning the house cup',
      RESET_SCORE: 'reset the scores please',
      SAY_HELLO: 'say hello to the students',
      CAN_I_JOIN: 'can i please join',
      SORTING_HAT: 'i would like to put my fate in the hands of the sorting hat',
      OBLIVIATE: 'obliviate',
      GET_BEST_STUDENT: 'best student',
      GET_MEANEST_STUDENT: 'meanest student',
      TELL_ME_ABOUT: {
        CALL: 'tell me about',
        JASON_MOM: 'jason\'s mom',
      },
      START_SORTING: 'start the sorting ceremony',
      GET_HOGWARTS_ROSTER: 'hogwarts roster',
      SAVE_GIT_NAME: 'link my github name=',
      SORT_REST: 'sort the rest'
    },
    HELP: {
      CALL: 'help'
    }
  },
  OUTPUT: {
    pointTo: (house, result) => 'Congratulations ' + capitalizeFirstLetter(house) + '! ' + capitalizeFirstLetter(house) + ' house has ' + result.points + ' points!',
    pointFrom: (house, result) => 'Alas ' + capitalizeFirstLetter(house) + '. ' + capitalizeFirstLetter(house) + ' house now only has ' + result.points + ' points. Do not dwell on your misdeeds, there is potential for greatness in all students!',
    getWinner: (house, result) => capitalizeFirstLetter(house) + ' House: ' + result + '\n',
    RESET_SCORE: 'The scores have been reset and we are ready for another great year at Hogwarts!',
    SAY_HELLO: 'Welcome to Hogwarts everyone!\n Now, in a few moments you will pass through these doors and join your classmates, but before you take your seats, you must be sorted into your houses. They are Gryffindor, Hufflepuff, Ravenclaw, and Slytherin. Now while you\'re here, your house will be like your family. Your triumphs will earn you points. Any rule breaking, and you will lose points. At the end of the year, the house with the most points is awarded the house cup.\n I Albus Dumbledore will award points on your behalf. Just say `10 points to Gryffindor` + or `5 points to @benc` to award points',
    canIJoin: (student, house) => 'Welcome ' + student.capitalizeFirstLetter() + ' the house of ' + house.capitalizeFirstLetter() + ' expects great things from you!',
    OBLIVIATE: 'Poof, even a remembrall wont help you now Gilderoy',
    getBestStudent: record => 'The head boy/girl of ' + capitalizeFirstLetter(record.house) + ' is @' + record.username + ' with ' + record.points_earned + ' points!',
    ABOUT_FROGS: '\n I think they\'ve earned some Chocolate Frogs.',
    getMeanestStudent: record => 'The student most likely to join the Inquisitorial Squad in ' + capitalizeFirstLetter(record.house) + ' is @' + record.username + ' who has taken a total of ' + record.points_taken + ' from their fellow students.',
    TELL_ME_ABOUT: {
      PERSON: {
        DUMBLEDORE: 'Well my name is Albus Percival Wulfric Brian Dumbledore, I am Headmaster of Hogwarts, I am famous for discovering the 12 uses of Dragon\'s blood, and my favorite candy is Lemon Drops.',
        student: record => record.username + ' belongs to ' + capitalizeFirstLetter(record.house) + ' House, they have: \n earned: ' + record.points_earned + ' points \n taken: ' + record.points_taken + ' points \n given: ' + record.points_given + ' points \nI\'m sure if you asked them in person they would tell you all this information themself. Good day.',
        NOT_FOUND: 'I am unfamiliar with that student. In all my years I have never come across such a person. However, if they are over the age of 11 and possess magical abilities, I invite them to come to Hogwarts. Perhaps they are a muggle, or worse a Squib.'
      },
      fromHouse: (house, record) => {
        let students = 'The students of ' + capitalizeFirstLetter(house) + ' House are:\n';

        record.forEach((name) => {
          students += name.username + '\n';
        });
        return students;
      },
      JASON_MOM: 'Not much is known about Jason\'s mom, except that she is thought to be responsible for the great internet unplugging of 2016',
    },
    START_SORTING: 'Students you have two choices for sorting. If you wish to choose your house you need only ask \'Professor can I please join Gryffindor\' For those more daring, you can let the Hat of Godric Gryffindor decide. Just say \'Professor I would like to put my fate in the hands of the Sorting Hat\' \n Good luck, let the sorting begin.',
    saveGitName: (userName, gitName) => userName + '\'s github name is saved as ' + gitName,
  },
  HOUSE: {
    GRYFFINDOR: 'gryffindor',
    HUFFLEPUFF: 'hufflepuff',
    RAVENCLAW: 'ravenclaw',
    SLYTHRIN: 'slytherin'
  },
  DB: {
    INFO: {
      CALL: 'Info',
      LASTRUN: 'lastrun'
    },
    HOUSE: {
      CALL: 'House'
    },
    CONTRIBUTOR: {
      CALL: 'Contributor',
      BOT_ID: 'botId',
      USER_ID: 'userId',
      POINT: 'point'
    },
    STUDENT: {
      CALL: 'Student'
    }
  }
};
