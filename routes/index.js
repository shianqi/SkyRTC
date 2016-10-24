var express = require('express');
var session = require('express-session');
var router = express.Router();
var path = require('path');

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*10 //cookie有效时间10min
    }
}));

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/room', function(req, res) {
    if(haveLogined(req.session.user)){
        res.render('room');
    }else{
        res.redirect('/');
    }
});

router.post('/login', function (req, res) {
    var user = {
        username:'admin',
        password:'admin'
    };
    if(req.body.username==user.username&&req.body.password==user.password){
        req.session.user = user;
        res.redirect('/room');
    }else{
        res.redirect('/');
    }
});

//判断用户是否登陆
var haveLogined = function (user) {
    if(typeof(user) == "undefined"){
        return false;
    }else{
        return true;
    }
};

module.exports = router;