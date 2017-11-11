const { DB } = require('../word');

async function checkBot(slackUers) {
  let slackUsers = slackUers.members;
  slackUsers = slackUsers.filter(function (person) {
    return (person.profile.bot_id === undefined);
  });
  return slackUsers;
}

//  봇이 만들어지고 추가된 봇 채널의 user정보 가져와서 student클래스 만듬
async function studentChannel(users) {
  const slackUers = await this.slackBot.getUsers();
  const slackUsers = await checkBot.call(this, slackUers);
  slackUsers.forEach((slackUser) => {
    if (users[slackUser.id]) {
      // exist
      const user = users[slackUser.id];
      if (user[DB.STUDENT.USER_NAME] !== slackUser.name) {
        const userInfo = new Parse.Object(DB.STUDENT.CALL);
        userInfo.id = user.id;
        userInfo.save({
          [DB.STUDENT.USER_NAME]: slackUser.name,
        });
      }
    } else {
      // new
      const userInfo = new Parse.Object(DB.STUDENT.CALL);
      userInfo.save({
        [DB.STUDENT.BOT_ID]: this.id,
        [DB.STUDENT.USER_ID]: slackUser.id,
        [DB.STUDENT.USER_NAME]: slackUser.name,
        [DB.STUDENT.POINT]: 0
      });
    }
  });
}

async function getUser() {
  const userQuery = new Parse.Query(DB.STUDENT.CALL);
  userQuery.equalTo(DB.STUDENT.BOT_ID, this.id);
  const users = {};
  await userQuery.each((user) => {
    users[user.get(DB.STUDENT.USER_ID)] = {
      id: user.id,
      [DB.STUDENT.USER_ID]: user.get(DB.STUDENT.USER_ID),
      [DB.STUDENT.USER_NAME]: user.get(DB.STUDENT.USER_NAME),
    };
  });
  console.log('saved user\'s count: ' + Object.keys(users).length);
  await studentChannel.call(this, users);
}

module.exports = getUser;
