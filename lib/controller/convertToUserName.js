async function convertToUserName(key) {
  const users = await this.slackBot.getUsers();
  const { members } = users;
  let userName;

  members.forEach((user) => {
    const { id, name } = user;
    if (id === key) userName = name;
  });

  return userName;
}
module.exports = convertToUserName;
