/*今天吃什么，根据cookie来判定内容，默认两个*/

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./eat');
});

module.exports = router;
