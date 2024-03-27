// required imports for router 
var express = require('express');
var router = express.Router();
let attendance = require('../models/attendance');
let labs = require('../models/labs');
let users = require('../models/users');

/* 
The following routes are needed: 
home/login 
home/login/register 
home/labs 
*/

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
      return res.status(401).json({ message: 'Incorrect password' });
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





module.exports = router;
