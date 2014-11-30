
var debug = require('debug')('kenobi');
var morgan = require('morgan');
var express = require('express');
var app = express();
var config = require('./config');

app.use('/', express.static(__dirname + '/public'));
app.use(morgan('tiny'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.param('aid', function (req, res, next, aid) {
  this.aid = aid;
});

app.get('/connectPocket/:aid', function (req, res) {
  res.render('connectPocket', {
    aid: this.aid
  });
});

app.post('/reader', function (req, res) {
  getObjFromStream(req, function (err, obj) {
    if (err) return res.status(500);
  });
});

app.listen(config.PORT);
debug("Yo, it's showtime");
debug("Server started at port "+config.PORT);

