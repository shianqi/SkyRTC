/**
 * Created by killer on 2016/10/23.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
    res.render('room');
});

module.exports = router;