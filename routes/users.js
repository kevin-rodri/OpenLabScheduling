var express = require('express');
var router = express.Router();
let users = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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

module.exports = router;
