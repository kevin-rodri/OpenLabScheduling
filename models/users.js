var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    firstName:  {
        type: String,
        required: true
    },
    lastName:  {
        type: String,
        required: true
    },
    role:  {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
        required: true
    }, 
    username: {
        type: String,
        unique : true,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var users = mongoose.model('user', userSchema);

module.exports = users;