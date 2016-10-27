var express = require('express');
var session = require('express-session');
var router = express.Router();
var path = require('path');
var room = require('./roomList');
var User = require('../models/user');

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*100 //cookie有效时间10min
    }
}));

router.get('/', function(req, res) {
    res.render('index',{'message':''});
});

router.get('/room', function(req, res) {
    if(haveLogined(req.session.user)){
        res.render('room');
    }else{
        res.redirect('/');
    }
});

router.get('/roomList', function (req, res) {
    if(haveLogined(req.session.user)){
        res.render('roomList',{roomList:room.getRoomList()});
    }else{
        res.redirect('/');
    }
});

router.post('/enterRoom', function (req, res) {
    if(haveLogined(req.session.user)){
        console.log(req.session.user.username+"进入"+req.body.roomNumber);
        room.enterRoom(req.body.roomNumber,req.session.user.username);
        res.redirect('/room#'+req.body.roomNumber);
    }else{
        res.redirect('/');
    }
});

router.post('/login', function (req, res) {
    User.findByUsername(req.body.username,function (err,date) {
        if(err){
            res.render('error',{'message':err})
        }else{
            if(date==null){
                res.render('index',{'message':'用户名或密码错误！'});
            }else if(req.body.username==date.username&&req.body.password==date.password){
                req.session.user = date;
                res.redirect('/roomList');
            }else{
                res.render('index',{'message':'用户名或密码错误！'});
            }
        }
    });
});

router.get('/addAdmin', function (req, res) {
    res.render('addAdmin');
});

router.post('/addAdmin', function (req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        type: req.body.type
    });
    user.save(function (err) {
        if (err){
            res.render('state',{state:'添加用户失败！'});
        }else{
            res.render('state',{state:'添加用户成功！'});
        }
    });
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