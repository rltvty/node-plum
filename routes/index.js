var express = require('express');
var router = express.Router();
var plum_config = require('../plum-config');
var plum_request = require('../plum-request');
var plum_watch = require('../plum-watch');

var living_room = plum_watch.new('10.10.10.145');
living_room.on('power', function(power) { console.log('power: ' + power); });
living_room.on('motion', function(motion) { console.log('motion: ' + motion); });
living_room.on('level', function(level) { console.log('level: ' + level); });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send(
      "GET /rooms\n" +
      "GET /room/:room_name/status\n"
  );
});

router.get('/rooms', function(req, res, next) {
    res.status(200).json(plum_config.rooms());
});

router.get('/rooms/:room_name/status', function(req, res, next) {
    var room_props = plum_config.room_props(req.params.room_name);
    if (room_props == null) {
        res.status(404).json({'error' : req.params.room_name + ' not found'});
    } else {
        var house_token = plum_config.house_token();
        plum_request.status(house_token, room_props,
            function callback(error, response, body) {
                if (!error) {
                    if (response.statusCode == 200) {
                        res.status(200).json({level:body.level, power:body.power});
                    } else {
                        res.status(response.statusCode).send(body);
                    }
                } else {
                    res.status(500).send(error)
                }
            });
    }
});

router.post('/rooms/:room_name/level/:level', function(req, res, next) {
    var room_props = plum_config.room_props(req.params.room_name);
    var level = parseInt(req.params.level);
    if (room_props == null) {
        res.status(404).json({'error' : req.params.room_name + ' not found'});
    } else {
        var house_token = plum_config.house_token();
        plum_request.setLevel(house_token, room_props, level,
            function callback(error, response, body) {
                if (!error) {
                    res.status(response.statusCode).send(body);
                } else {
                    res.status(500).send(error)
                }
            });
    }
});

module.exports = router;
