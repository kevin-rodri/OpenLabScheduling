// required imports for router 
var express = require('express');
let Attendance = require('../models/attendance');
var router = express.Router();
let labs = require('../models/labs');
let users = require('../models/users');

// Get and update lab roster 
router.route('/labs/:labId/roster')
  .get(async (req, res, next) => {
    try {
      const labId = req.params.labId;

      // Find the attendance for the lab
      const attendancee = await Attendance.findOne({ labId });
      // ensures a roster exists 
      if (!attendancee) {
        return res.status(404).json({ message: 'Lab attendance not found' });
      }
      // display roster
      res.json(attendancee.absenceList);
    } catch (e) {
      console.error("Error retrieving lab roster", e);
      res.status(500).send("Internal server error");
    }
  })
  .put(async (req, res, next) => {
    try {
      const labId = req.params.labId;
      const roster = req.body.absenceList;

      // Find the attendance for the lab
      const attendancee = await Attendance.findOne({ labId });

      if (!attendancee) {
        return res.status(404).json({ message: 'Lab attendance not found' });
      }

      // Update the student's attendance status
      attendancee.absenceList = roster;
      await attendancee.save();

      res.json({ message: 'Roster updated successfully' , roster: attendancee.absenceList});
    } catch (e) {
      console.error("Error updating roster", e);
      res.status(500).send("Internal server error");
    }
  });


  module.exports = router;