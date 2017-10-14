function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}
module.exports.atob = atob;

function btoa(str) {
  return Buffer.from(str, 'binary').toString('base64');
}
module.exports.btoa = btoa;
