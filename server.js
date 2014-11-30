
var debug = require('debug')('kenobi');
var morgan = require('morgan');
var express = require('express');
var app = express();
var config = require('./config');
var request = require('request');

app.use('/', express.static(__dirname + '/public'));
app.use(morgan('tiny'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var codeForAid = {};

app.param('aid', function (req, res, next, aid) {
  req.aid = aid;
  next();
});

app.get('/connectPocket/:aid', function (req, res) {

  // We retrieve a request token for the Pocket server
  var json = {
    consumer_key: config.POCKET_CKEY,
    redirect_uri: config.FRONTEND_URL + '/linkedPocket/' + req.aid
  };
  
  request.post({
    url: 'https://getpocket.com/v3/oauth/request',
    headers : {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    },
    body: JSON.stringify(json),
  }, function (err, response, body) {
    debug('got pocket request token');
    if (err) return res.status(500);
    if (response.statusCode != 200) return res.send(response.statusCode + ': ' + response.statusMessage);
    var obj = JSON.parse(body);
    debug(obj);
    res.render('connectPocket', {
      code: obj.code,
      redirect_uri: json.redirect_uri
    });
    codeForAid[req.aid] = obj.code;
  });

});

app.get('/linkedPocket/:aid', function (req, res) {
  request.post({
    url: config.BACKEND_URL + '/linkPocket/',
    headers : { Authorization: req.aid },
    json: { code: codeForAid[req.aid] }
  });
  delete codeForAid[req.aid];
  res.render('linkedPocket');
});

app.get('/reader', function (req, res) {
  var obj = JSON.parse(new Buffer(req.params.json, 'base64'));
  res.render('reader', {
    url: obj.url,
    aid: obj.aid,
    item_id: obj.item_id
  });
});

app.get('*', function (req, res) {
  res.send('you lost bro?');
});

app.listen(config.PORT);
debug("Yo, it's showtime");
debug("Server started at port " + config.PORT);

