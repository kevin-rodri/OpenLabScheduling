// required imports for router 
var express = require('express');
var router = express.Router();
let abscence = require('../models/absence');
let labs = require('../models/labs');
let users = require('../models/users');

router.route('/')
.get( async (req, res, next) => {
    // Retrieves all users
    try {
        const data = await users.find({}); 
        res.json(data); // convert to json and return in res
      } catch (e) {
        console.log("Error failed to query", e);
      }
})
.post( async (req, res, next) => {
  // Posing/creating one user
  try {
    const user = await users.create(req.body);
    let id = user._id;
    res.send(`Added the following user with the following id: ${id}`);
  } catch (e) {
    console.log("Failed to save data in db");
  }
})

// route for when trying to retrieve a user based on specified id
router.route('/:userId')
.get(async (req, res, next) => {
    // retrieves one user by id 
    try {
        const user = await users.findById(req.params.userId); 
        res.json(user);
      } catch (e) {
        console.log("Error retriving user", e);
      }

})
.put( async (req, res, next) => {
    // Updating a user using an id.
    try {
        const user = await users.findByIdAndUpdate(
          req.params.userId,
          req.body
        );

        console.log('user info has been updated');
        res.json(user);
      } catch (e) {
        console.log("Error updating user", e);
      }
})
.delete(async (req, res, next) => {
    // Deleting a user based on specified id.
    try {
        const user = await users.findByIdAndDelete(req.params.userId);
        console.log('User deleted');
        res.json(user);
      } catch (e) {
        console.log("Error deleting user", e);
      }
  });



module.exports = router;
