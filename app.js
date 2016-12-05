var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({'error': err.message});
});

module.exports = app;

var watch = require('./plum-watch');
var config = require('./plum-config');
var request = require('./plum-request');

var all_ips = config.all_ips();
var watchers = {};
var bathrooms = {};

for (var i in all_ips) {
    var name = all_ips[i].room_name;
    while (name in watchers) {
        name = name + '_';
    }
    var watcher = watch.new(all_ips[i].ip, name);
    watcher.on('power', function (power, name) {
        console.log(name + ' power: ' + power);
    });
    watcher.on('motion', function (motion, name) {
        console.log(name + ' motion: ' + motion);
    });
    watcher.on('level', function (level, name) {
        console.log(name + ' level: ' + level);
    });
    watchers[name] = watcher;

    if (name == 'Downstairs Bathroom' || name == 'Master Bath') {
        watcher.on('motion', function (motion, name) {
            var motion_threshold = (name == 'Downstairs Bathroom') ? 720 : 720;
            if (motion > motion_threshold) {
                console.log('motion detected in ' + name);
                var token = config.house_token();
                var props = config.room_props(name);
                request.status(token, props,
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log('current level in ' + name + ' is ' + body.level);
                            if (body.level < 1) {
                                console.log('current level in ' + name + ' is too low, setting higher...');
                                request.setLevel(token, props, 1,
                                    function callback(error, response, body) {
                                        if (!error && response.statusCode == 204) {
                                            console.log('SUCCESS setting level in ' + name);
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            }
        });
    }
}
