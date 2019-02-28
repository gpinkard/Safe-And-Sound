var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/studentlogin', function(req, res, next) {
  res.render('studentFacing', { title: 'Student login' });
});

module.exports = router;
