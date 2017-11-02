const {
  INPUT, OUTPUT, DB
} = require('../word');

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


async function studentStats(originalMessage) {
  const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];

  if (convertToUserName(student) !== 'dumbledore') {
    const Contributor = new Parse.Object(DB.CONTRIBUTOR.CALL);
    const query = new Parse.Query(Contributor);
    query.equalTo('user_id', student);
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
  } else {
    this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.DUMBLEDORE);
  }
}

async function bestStudentChannel(contributor) {
  const Contributor = new Parse.Object(contributor);
  const query = new Parse.Query(Contributor);

  query.descending(DB.CONTRIBUTOR.POINT);
  try {
    const record = await query.first();
    return record;
  } catch (err) {
    console.error('DATABASE ERROR', err);
  }
}

async function bestStudent(originalMessage) {
  const record = await bestStudentChannel(DB.CONTRIBUTOR.CALL);
  this.slackBot.announcePlainString(originalMessage, OUTPUT.getBestStudent(record.attributes));
}

async function worstStudentChannel(contributor) {
  const Contributor = new Parse.Object(contributor);
  const query = new Parse.Query(Contributor);

  query.ascending(DB.CONTRIBUTOR.POINT);
  try {
    const record = await query.first();
    return record;
  } catch (err) {
    console.error('DATABASE ERROR', err);
  }
}

async function worstStudent(originalMessage) {
  const record = await worstStudentChannel(DB.CONTRIBUTOR.CALL);
  this.slackBot.announcePlainString(originalMessage, OUTPUT.getMeanestStudent(record.attributes));
}

function tellMeAbout(originalMessage) {
  const text = originalMessage.text.toLowerCase();

  if (text.includes('@')) {
    studentStats.call(this, originalMessage);
  } else if (text.includes(INPUT.PROFESSOR.JASON_MOM)) {
    this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.JASON_MOM);
  }
}

function saveGitName(originalMessage) {
  const Contributor = new Parse.Object(DB.CONTRIBUTOR.CALL);
  const query = new Parse.Query(Contributor);
  const gitName = originalMessage.text.split('=')[1];
  const { user } = originalMessage;
  query.equalTo('user_id', user);
  Contributor.set('GITHUB_NAME', gitName);
  this.slackBot.announcePlainString(originalMessage, OUTPUT.saveGitName(convertToUserName(user), gitName));
/*
  this.db.run('UPDATE students SET github_name = ? WHERE user_id = ?', gitName, user, (err) => {
    if (err) {
      return console.error('DATABASE ERROR', err);
    }
    this.slackBot.announcePlainString(originalMessage, OUTPUT.saveGitName(convertToUserName(user), gitName));
  });
  */
}

function replyWithDumbledore(originalMessage) {
  const text = originalMessage.text.toLowerCase();

  const parseCase = {
    [INPUT.PROFESSOR.GET_BEST_STUDENT]: () => bestStudent.call(this, originalMessage),
    [INPUT.PROFESSOR.GET_MEANEST_STUDENT]: () => worstStudent.call(this, originalMessage),
    [INPUT.PROFESSOR.TELL_ME_ABOUT]: () => tellMeAbout.call(this, originalMessage),
    [INPUT.PROFESSOR.SAVE_GIT_NAME]: () => saveGitName.call(this, originalMessage)
  };

  Object.keys(parseCase).forEach(key => {
    if (text.includes(key)) {
      parseCase[key]();
    }
  });
}

module.exports = replyWithDumbledore;
