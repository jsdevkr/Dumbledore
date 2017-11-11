async function convertToUserName(key) {
  const users = await this.slackBot.getUsers();
  const { members = [] } = users;

  return members.find((userid) => {
    if (userid.id === key || userid.name === key) {
      return userid.name;
    }
    return false;
  });
}
module.exports = convertToUserName;
