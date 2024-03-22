var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var labSchema = new Schema({
    labName:  {
        type: String,
        required: true
    },
    labDate:  {
        type: Date,
        required: true
    },
    labLocation:  {
        type: String,
        required: true
    },
    labCapacity: {
        type: Number,
        required: true
    },
    labType: {
        type: String,
        required: true
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {
    timestamps: true
});

var labs = mongoose.model('lab', labSchema);

module.exports = labs;