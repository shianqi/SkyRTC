var express = require('express');
var fs = require('fs');
var path = require("path");
var app = express();
var bodyParser = require('body-parser');

var roomList = require('./routes/roomList');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var session = require('express-session');

var room = require('./routes/roomList');
var User = require('./models/user');

var key = fs.readFileSync('keys/newkey.pem');
var cert = fs.readFileSync('keys/cert.pem');
//https密钥
var https_options = {
    key: key,
    cert: cert
};
var server = require('https').createServer(https_options,app);
var SkyRTC = require('skyrtc').listen(server);

var port = process.env.PORT || 443;
server.listen(port);

//配置请求头
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    next();
});

//链接mongodb数据库
mongoose.connect('mongodb://localhost/skyRtc');

//配置公共资源文件夹
app.use(express.static(path.join(__dirname, 'public')));

//配置post请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//配置cookie
app.use(cookieParser());

//配置前端模版为ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

SkyRTC.rtc.on('new_connect', function(socket) {
    console.log('创建新连接');
});

SkyRTC.rtc.on('remove_peer', function(socketId) {
    roomList.leaveRoom(socketId);
    console.log(socketId + "用户离开");
});

SkyRTC.rtc.on('new_peer', function(socket, room) {
    roomList.enterRoomSocket(room, socket.id);
    console.log("新用户" + socket.id + "加入房间" + room);
});

SkyRTC.rtc.on('socket_message', function(socket, msg) {
    console.log("接收到来自" + socket.id + "的新消息：" + msg);
});

SkyRTC.rtc.on('ice_candidate', function(socket, ice_candidate) {
    console.log("接收到来自" + socket.id + "的ICE Candidate");
});

SkyRTC.rtc.on('offer', function(socket, offer) {
    console.log("接收到来自" + socket.id + "的Offer");
});

SkyRTC.rtc.on('answer', function(socket, answer) {
    console.log("接收到来自" + socket.id + "的Answer");
});

SkyRTC.rtc.on('error', function(error) {
    console.log("发生错误：" + error.message);
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*100 //cookie有效时间10min
    }
}));

app.get('/', function(req, res) {
    res.render('index',{'message':''});
});

app.get('/room', function(req, res) {
    if(haveLogined(req.session.user)){
        res.render('room');
    }else{
        res.redirect('/');
    }
});

app.get('/roomList', function (req, res) {
    if(haveLogined(req.session.user)){
        res.render('roomList',{roomList:SkyRTC.rtc.rooms});
    }else{
        res.redirect('/');
    }
});

app.post('/enterRoom', function (req, res) {
    if(haveLogined(req.session.user)){
        console.log(req.session.user.username+"进入"+req.body.roomNumber);
        room.enterRoomHttp(req.body.roomNumber,req.session.user.username);
        res.redirect('/room#'+req.body.roomNumber);
    }else{
        res.redirect('/');
    }
});

app.post('/login', function (req, res) {
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

app.get('/addAdmin', function (req, res) {
    res.render('addAdmin');
});

app.post('/addAdmin', function (req, res) {
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