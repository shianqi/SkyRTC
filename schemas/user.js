/**
 * 用户Schema
 * Created by killer on 2016/10/24.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    nickname: String,
    type: String
});

userSchema.statics = {
    findByUsername: function (value,cb) {
        return this
            .findOne({username:value})
            .exec(cb);
    }
};

module.exports = userSchema;
