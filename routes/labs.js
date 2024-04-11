var express = require('express');
var router = express.Router();
let labs = require('../models/labs');
let users = require('../models/users');
let Attendance = require('../models/attendance');


/* GET users listing. This will do just for now... */
// Retrieves all the labs
router.route('/')
.get(async (req, res, next) => {
  try {
    const labInfo = await labs.find({}); 
    res.json(labInfo); // convert to json and return the listed labs
  } catch (e) {
    console.log("Error failed to query", e);
  }
})
.post( async (req, res, next) => {
  // Adds a new lab 
  try {
    // let's ensure only admins add labs 
    const user = await users.findById(req.body.instructor);
    if (user.role != 'admin'){
      return res.status(401).json({ message: 'You must be an admin to add a lab' });
    }
    
    // if user's admin, then info can be added 
    const lab = await labs.create(req.body);
    let id = lab._id;
      // we can rid of this after several iterations. - testing purposes 
    res.send(`Added the following lab with the following id: ${id}`);

  } catch (e) {
    console.log("Failed to save data in db");
  }
})

//Registers lab - route had to be modified in order to add a student 
router.route('/:labId/registerLab/:studentId')
  .post(async (req, res, next) => {
    try {
      const labId = req.params.labId;
      const studentId = req.params.studentId; 

      // checks if Attendance for the Lab exists
      let attendancee = await Attendance.findOne({ labId });

      if (!attendancee) {
        // if not, create one 
        attendancee = new Attendance({
          labId: labId,
          absenceList: []
        });
      }

      // adds student to attendance list - will make students absent for admin to modify themselves 
      attendancee.absenceList.push({ status: 'absent', studentId });

      await attendancee.save();

      res.json({ message:'User registered for the lab successfully' });
    } catch (e) {
      console.error("Error registering for lab", e);
      res.status(500).send("Internal server error");
    }
  });

// Delete a lab 
router.route('/:labId')
.delete(async (req, res, next) => {
  try {
    const labId = req.params.labId;

    // Delete the lab
    await labs.findByIdAndDelete(labId);

    res.json({ message: 'Lab deleted successfully' });
  } catch (e) {
    console.error("Error deleting lab", e);
    res.status(500).send("Internal server error");
  }
})
// Update lab details 
.put(async (req, res, next) => {
  try {
    const labId = req.params.labId;
    const updates = req.body;

    // Update the lab
    const updatedLab = await labs.findByIdAndUpdate(labId, updates, { new: true });

    res.json(updatedLab);
  } catch (e) {
    console.error("Error updating lab", e);
    res.status(500).send("Internal server error");
  }
});

// Get labs created by an instructor 
router.route('/:userId')
.get(async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find labs created by the instructor
    const instructorLabs = await labs.find({ instructor: userId });

    res.json(instructorLabs);
  } catch (e) {
    console.error("Error retrieving instructor's labs", e);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;