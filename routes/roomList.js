/**
 * Created by killer on 2016/10/27.
 */
var express = require('express');
var router = express.Router();
var roomList = [];

router.getRoomList = function () {
    return roomList;
};

router.enterRoom = function (roomNumber, username) {
    if(typeof(roomList[roomNumber]) == "undefined"){
        roomList[roomNumber] = [];
    }
    roomList[roomNumber].push({username:username});
    console.log(roomList);
};

router.leaveRoom = function (roomNumber, username) {
    roomList[roomNumber].pop({username:username});
};

module.exports = router;