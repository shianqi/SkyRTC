/**
 * Created by killer on 2016/10/27.
 */
var express = require('express');
var router = express.Router();
var roomList = [];
var lastUser = null;


router.enterRoomHttp = function (roomNumber, username) {
    lastUser = username;
};

router.enterRoomSocket = function (roomNumber, socketId) {

    if(typeof(roomList[roomNumber]) == "undefined"){
        roomList[roomNumber] = [];
    }
    roomList[roomNumber].push({username:lastUser,socketId:socketId});
};

router.leaveRoom = function (socketId) {

};

module.exports = router;