const {
  DB
} = require('../word');

async function checkBot(student) {
  let realUser = student.members;
  realUser = realUser.filter(function (person) {
    return (person.profile.bot_id === undefined);
  });
  return realUser;
}

//  봇이 만들어지고 추가된 봇 채널의 user정보 가져와서 student클래스 만듬
async function studentChanel() {
  const student = await this.slackBot.getUsers();
  const realUser = await checkBot.call(this, student);
  realUser.filter((user) => {
    const userInfo = new Parse.Object(DB.STUDENT.CALL);
    userInfo.save({
      [DB.STUDENT.BOT_ID]: this.name,
      [DB.STUDENT.USER_ID]: user.id,
      [DB.STUDENT.USER_NAME]: user.name,
      [DB.STUDENT.POINT]: 0
    });
    return user;
  });
}

async function getUser() {
  const userQuery = new Parse.Query(DB.STUDENT.CALL);
  const userCount = await userQuery.count();
  console.log('userCount: ' + userCount);
  if (!userCount) {
    await studentChanel.call(this);
  }
}

module.exports = getUser;
