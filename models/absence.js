var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var absenceSchema = new Schema({
  labId: {
    type: Schema.Types.ObjectId,
    ref: 'labs',
    required: true
    } , 
  absenceList: [{
    status: {
      type: String,
      enum: ['present', 'absent'],
      default: 'present',
      required: true
  }, studentId:  {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}] 
},{
  timestamps: true
});

// absenceSchema.pre('save', function(next) {
//   if (this.studentId.length === 0) {
//     next(new Error('Validation error: studentId is required.'));
//   } else {
//     next();
//   }
// });
 

var Absences = mongoose.model('absence', absenceSchema);

module.exports = Absences;