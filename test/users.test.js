const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);


const User = require('../models/users');

describe('User Schema Tests', function () {
    let mongoServer;

    before(async function () {
        this.timeout(10000);
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    after(async function () {
        if (mongoServer) {
            await mongoose.disconnect();
            await mongoServer.stop();
        }
    });

    beforeEach(async function () {
        // Clear the users collection before each test
        await User.deleteMany({});
    });

    // Test to ensure firstName, lastName, username, and password are required fields
    it('should require firstName, lastName, username, and password', async function () {
        const user = new User({
            role: 'student'
        });
        // Expect saving this user to fail due to missing required fields
        await expect(user.save()).to.be.rejectedWith(mongoose.Error.ValidationError);
    });

    // Test to check that the role field defaults to 'student'
    it('should have "student" as default role', async function () {
        const user = new User({
            firstName: 'Nikola',
            lastName: 'Tesla',
            username: 'Nikola.Tesla@test.com',
            password: 'password123'
        });
        // Expect saving the user to succeed and the role to be 'student'
        await expect(user.save()).to.be.fulfilled;
        expect(user.role).to.equal('student');
    });

    // Test to ensure role can only be 'student' or 'admin'
    it('should only allow "student" or "admin" as roles', async function () {
        const user = new User({
            firstName: 'Elon',
            lastName: 'Musk',
            username: 'Elon.Musk@example.com',
            password: 'password123',
            role: 'teacher' // Providing an invalid role to test
        });
        // Expect saving this user to fail due to invalid role
        await expect(user.save()).to.be.rejectedWith(mongoose.Error.ValidationError);
    });

    // Test to ensure the username is unique across all documents
    it('should enforce unique username', async function () {
        // Save a first user with a unique username
        const user1 = new User({
            firstName: 'Alan',
            lastName: 'Turing',
            username: 'unique.username@example.com',
            password: 'password123',
            role: 'student'
        });
        await user1.save();
        // Attempt to save a second user with the same username
        const user2 = new User({
            firstName: 'Ada',
            lastName: 'Lovelace',
            username: 'unique.username@example.com',
            password: 'password123',
            role: 'student'
        });
        // Expect saving the second user to fail due to the unique username constraint
        await expect(user2.save()).to.be.rejected;
    });
    
    // Test to check if timestamps (createdAt and updatedAt) are automatically added
    it('should automatically add timestamps', async function () {
        const user = new User({
            firstName: 'Steve',
            lastName: 'Jobs',
            username: 'Steve.Jobs@example.com',
            password: 'password123',
            role: 'student'
        });
        const savedUser = await user.save();
        expect(savedUser).to.have.property('createdAt');
        expect(savedUser).to.have.property('updatedAt');
    });
});
