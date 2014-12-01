
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
  var json = { code: codeForAid[req.aid] };
  request.post({
    url: config.BACKEND_URL + '/linkPocket/',
    headers : {
      Authorization: req.aid,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(json)
  }, function (err) {
    if (err) console.log('KEKKKKKKK linkPocket req failed');
  });
  debug('Sending...');
  debug(json);
  setTimeout(function () {
    delete codeForAid[req.aid];
  }, 1000);
  res.render('linkedPocket');
});

app.get('/reader', function (req, res) {
  debug('reader');
  /*
  res.render('reader', {
    url: req.query.url,
    aid: req.query.aid,
    item_id: req.query.item_id
  });
  */
  res.redirect(req.query.url);

  var json = { item_id: req.query.item_id };
  // TO-DO: Mark as read when scrolled to the end instead of inmediately
  request.post({
    url: config.BACKEND_URL + '/readLink/',
    headers : {
      Authorization: req.query.aid,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(json)
  });
});

app.get('*', function (req, res) {
  res.send('you lost bro?');
});

app.listen(config.PORT);
debug("Yo, it's showtime");
debug("Server started at port " + config.PORT);

