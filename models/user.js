/**
 * 用户model
 * Created by killer on 2016/10/24.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');

var User = mongoose.model('User', UserSchema);

module.exports = User;