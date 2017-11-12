const {
  INPUT, OUTPUT, DB
} = require('../const');

async function studentStats(originalMessage) {
  const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
  const userName = await this.convertToUserName(student);
  if (userName.name !== 'dumbledore') {
    const Student = new Parse.Object(DB.STUDENT.CALL);
    const query = new Parse.Query(Student);
    query.equalTo(DB.STUDENT.BOT_ID, this.id);
    query.equalTo(DB.STUDENT.USER_NAME, userName.name);

    try {
      const record = await query.first();
      if (record.attributes !== undefined) {
        this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.student(record.attributes));
      } else {
        this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.NOT_FOUND);
      }
    } catch (err) {
      console.error('DATABASE ERROR', err);
    }
  } else {
    this.slackBot.announcePlainString(originalMessage, OUTPUT.TELL_ME_ABOUT.PERSON.DUMBLEDORE);
  }
}

async function bestStudentChannel(student) {
  const Student = new Parse.Object(student);
  const query = new Parse.Query(Student);

  query.descending(DB.STUDENT.POINT);
  try {
    const record = await query.first();
    return record;
  } catch (err) {
    console.error('DATABASE ERROR', err);
  }
}

async function bestStudent(originalMessage) {
  const record = await bestStudentChannel(DB.STUDENT.CALL);
  this.slackBot.announcePlainString(originalMessage, OUTPUT.getBestStudent(record.attributes));
}

async function worstStudentChannel(student) {
  const Student = new Parse.Object(student);
  const query = new Parse.Query(Student);

  query.ascending(DB.STUDENT.POINT);
  try {
    const record = await query.first();
    return record;
  } catch (err) {
    console.error('DATABASE ERROR', err);
  }
}

async function worstStudent(originalMessage) {
  const record = await worstStudentChannel(DB.STUDENT.CALL);
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

async function listStudentChannel(student) {
  const Student = new Parse.Object(student);
  const query = new Parse.Query(Student);
  query.descending(DB.STUDENT.POINT);
  try {
    const record = await query.find();
    return record;
  } catch (error) {
    console.log(error);
  }
}

async function listStudent(originalMessage) {
  const record = await listStudentChannel(DB.STUDENT.CALL);
  this.slackBot.announcePlainString(originalMessage, OUTPUT.getListStudent(record));
}

function saveGitName(originalMessage) {
  const Student = new Parse.Object(DB.STUDENT.CALL);
  const query = new Parse.Query(Student);
  const gitName = originalMessage.text.split('=')[1];
  const { user } = originalMessage;
  query.equalTo('user_id', user);
  Student.set('GITHUB_NAME', gitName);
  this.slackBot.announcePlainString(originalMessage, OUTPUT.saveGitName(this.convertToUserName(user), gitName));
}

function replyWithDumbledore(originalMessage) {
  const text = originalMessage.text.toLowerCase();

  const parseCase = {
    [INPUT.PROFESSOR.GET_BEST_STUDENT]: () => bestStudent.call(this, originalMessage),
    [INPUT.PROFESSOR.GET_MEANEST_STUDENT]: () => worstStudent.call(this, originalMessage),
    [INPUT.PROFESSOR.GET_LIST_STUDENT]: () => listStudent.call(this, originalMessage),
    [INPUT.PROFESSOR.TELL_ME_ABOUT.CALL]: () => tellMeAbout.call(this, originalMessage),
    [INPUT.PROFESSOR.SAVE_GIT_NAME]: () => saveGitName.call(this, originalMessage)
  };

  Object.keys(parseCase).forEach(key => {
    if (text.includes(key)) {
      parseCase[key]();
    }
  });
}

module.exports = replyWithDumbledore;
