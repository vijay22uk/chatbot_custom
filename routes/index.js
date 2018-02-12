var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome' ,user: req.user});
  console.log(res.value);
});
router.get('/ms', function(req, res, next) {
  res.render('indexms', { title: 'Welcome' ,user: req.user});
  console.log(res.value);
});


module.exports = router;
