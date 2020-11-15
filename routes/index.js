var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.json({'text': 'My json'});
});

module.exports = router;
