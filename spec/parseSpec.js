describe('parse', function () {
  it('parse application id', (done) => {
    expect(Parse.applicationId).toEqual(process.env.APP_ID || 'myAppId');
    done();
  });

  it('create object', (done) => {
    let objId;
    const _obj = new Parse.Object('AnObject');
    _obj.save()
      .then(obj => {
        objId = obj.id;
        const q = new Parse.Query('AnObject');
        q.descending('createdAt');
        return q.first();
      })
      .then(obj => {
        expect(obj.id).toEqual(objId);
        done();
      })
      .catch((error) => {
        fail(JSON.stringify(error));
        done();
      });
  });
});
