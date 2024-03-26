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

absenceSchema.pre('save', function(next) {
  if (this.studentId.length === 0) {
    next(new Error('Validation error: studentId is required.'));
  } else {
    next();
  }
});
 

var Absences = mongoose.model('absence', absenceSchema);

module.exports = Absences;