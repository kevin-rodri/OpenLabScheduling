var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var absenceSchema = new Schema({
    studentId:  {
        type: [Schema.Types.ObjectId],
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'present',
        required: true
    }
}, {
    timestamps: true
});

var absences = mongoose.model('absence', absenceSchema);

module.exports = absences;