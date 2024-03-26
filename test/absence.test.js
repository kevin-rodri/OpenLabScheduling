const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);


const Absence = require('../models/absence'); 


describe('Absence Schema Tests', function () {
    let mongoServer;


    before(async function () {
        this.timeout(5000); 
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);  });

   after(async function () {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    // Test to ensure the studentId field is required
    it('should require a studentId', async function () {
        const absenceWithoutStudentId = new Absence({ status: 'present' });
        // Attempting to save an Absence document without a studentId should result in an error
        await expect(absenceWithoutStudentId.save()).to.be.rejectedWith(Error, 'Validation error: studentId is required.');
    });

    // Test to check the default value of the status field
    it('should default status to "present"', async function () {
        const studentId = new mongoose.Types.ObjectId(); 
        const absence = new Absence({ studentId });
        const savedAbsence = await absence.save();

        // The saved document should have 'present' as its status by default
        expect(savedAbsence.status).to.equal('present');
    });

    // Test to ensure the status field only allows 'present' or 'absent'
    it('should allow only "present" or "absent" as status', async function () {
        const studentId = new mongoose.Types.ObjectId(); // Mock student ID
        // Create a valid Absence with 'absent' status
        const validAbsence = new Absence({ studentId, status: 'absent' });
        await expect(validAbsence.save()).to.eventually.be.fulfilled;

        // Attempt to save an Absence with an invalid status value, which should fail
        const invalidAbsence = new Absence({ studentId, status: 'invalid_status' });
        await expect(invalidAbsence.save()).to.eventually.be.rejectedWith(mongoose.Error.ValidationError);
    });

    // Test to verify that timestamps (createdAt and updatedAt) are automatically added to documents
    it('should automatically add timestamps', async function () {
        const studentId = new mongoose.Types.ObjectId(); // Mock student ID
        const absence = new Absence({ studentId });
        const savedAbsence = await absence.save();

        // The saved document should have both 'createdAt' and 'updatedAt' fields
        expect(savedAbsence).to.have.property('createdAt');
        expect(savedAbsence).to.have.property('updatedAt');
    });
});
