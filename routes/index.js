var express = require('express');
var router = express.Router();
var plum_config = require('../plum-config');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send(
      "GET /rooms               List of rooms that can be controlled\n"
  );
});

router.get('/rooms', function(req, res, next) {
    res.status(200).json(plum_config.rooms());
});

module.exports = router;
