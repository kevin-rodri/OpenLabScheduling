// required imports for router 
var express = require('express');
let Attendance = require('../models/attendance');
var router = express.Router();
let labs = require('../models/labs');
let users = require('../models/users');

// these contain the list of routes that are proposed in our doc

// might not need this one- this is just a placeholder
router.route('/')
.get( async (req, res, next) => {
    res.send('Hello there!');
})


// route for logging in to the system
router.route('/login')
.post( async (req, res, next) => {
 try {
  const {username, password} = req.body; 
  const user = await users.findOne({ username });
  // ensure the registered user exists 
  // https://medium.com/@anandam00/build-a-secure-authentication-system-with-nodejs-and-mongodb-58accdeb5144 - controllers/auth.js was referenced 

  // ensures user is actually registered
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordConfirm = user.password;
    // verifies if password passed in matches the one saved in db
    if (passwordConfirm!= password) {
      return res.status(401).json({ message: 'Incorrect password' }); // this should fail if the password to assgin user does not match w/ what's saved in the db 
    }
    // return the user info if user's account info exists 
    res.json(user);
} catch (e) {
  console.log("Error retriving user", e);
}
})


// responsible for creating a new registered student with the corresponding information. 
router.route('/login/register')
.post(async (req, res, next) => {
  try {
   // find if the user exists 
   const user = await users.create(req.body);
   let id = user._id;
      // we can rid of this after several iterations. - testing purposes 
    res.send(`Added the following user with the following id: ${id}`);
  }catch (e) {
    console.log("Error failed to query", e);
  }
});

// home/labs 
// Retrieves all the labs
router.route('/labs')
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
router.route('/labs/:labId/registerLab/:studentId')
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
router.route('/labs/:labId')
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
// Update lab details - WORKS
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

      res.json({ message: 'Roster updated successfully' });
    } catch (e) {
      console.error("Error updating roster", e);
      res.status(500).send("Internal server error");
    }
  });


// Get labs created by an instructor 
router.route('/labs/:userId')
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
//trying to repush

module.exports = router;