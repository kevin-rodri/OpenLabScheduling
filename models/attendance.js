var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var attendanceSchema = new Schema({
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

 

var Attendance = mongoose.model('attendance', attendanceSchema);

module.exports = Attendance;