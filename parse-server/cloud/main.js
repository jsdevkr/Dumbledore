const { DB } = require('../../lib/const');

Parse.Cloud.define('hello', function (req, res) {
  res.success('Hi');
});


// logging before point exchange
Parse.Cloud.beforeSave(DB.STUDENT.CALL, function (req, res) {
  const afterPoint = req.object.get(DB.STUDENT.POINT);
  const beforePoint = req.original ? req.original.get(DB.STUDENT.POINT) : 0;

  const message = {
    [DB.MESSAGE.BOT_ID]: req.object.get(DB.STUDENT.BOT_ID),
    [DB.MESSAGE.USER_ID]: req.object.get(DB.STUDENT.USER_ID),
    [DB.MESSAGE.AMOUNT]: afterPoint - beforePoint,
    [DB.MESSAGE.OP]: afterPoint > beforePoint > 0 ? 'increment' : 'decrement'
  };

  const Message = new Parse.Object(DB.MESSAGE.CALL);
  Message.save(message);

  res.success();
});

// todo: if user call keword, should update log.
// Parse.Cloud.beforeSave(DB.MESSAGE.CALL, function () {});

