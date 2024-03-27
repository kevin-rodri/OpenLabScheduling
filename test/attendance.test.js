const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);


const Attendance = require('../models/attendance'); 


describe('Absence Schema Tests', function () {
    let mongoServer;


    before(async function () {
        this.timeout(10000); 
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);  });

   after(async function () {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

     // Test to ensure the studentId field is required
    it('should require a studentId', async function () {
        const labId = new mongoose.Types.ObjectId(); // Mock lab ID
        const absenceWithoutStudentId = new Attendance({ labId, absenceList: [{ status: 'absent' }] });
        return expect(absenceWithoutStudentId.save()).to.be.rejectedWith(mongoose.Error.ValidationError, 'attendance validation failed: absenceList.0.studentId: Path `studentId` is required.');
    });
    
    // Test to check the default value of the status field
    it('should default status to "present"', async function () {
        const studentId = new mongoose.Types.ObjectId(); 
        const labId =  new mongoose.Types.ObjectId(); 
        const absence = new Attendance({ labId, absenceList: [{ studentId }] });
        const savedAbsence = await absence.save();

        // The saved document should have 'present' as its status by default
        expect(savedAbsence.absenceList[0].status).to.equal('present');
    });

    // Test to ensure the status field only allows 'present' or 'absent'
    it('should allow only "present" or "absent" as status', async function () {
        const studentId = new mongoose.Types.ObjectId(); // Mock student ID
        const labId =  new mongoose.Types.ObjectId(); 
        // Create a valid Absence with 'absent' status
        const validAbsence = new Attendance({ labId , absenceList: [{ studentId, status: 'absent' }] });
        await expect(validAbsence.save()).to.eventually.be.fulfilled;

        // Attempt to save an Absence with an invalid status value, which should fail
        const invalidAbsence = new Attendance({ labId , absenceList: [{ studentId, status: 'invalid_status' }] });
        await expect(invalidAbsence.save()).to.eventually.be.rejectedWith(mongoose.Error.ValidationError);
    });

    // Test to verify that timestamps (createdAt and updatedAt) are automatically added to documents
    it('should automatically add timestamps', async function () {
        const studentId = new mongoose.Types.ObjectId(); // Mock student ID
        const labId =  new mongoose.Types.ObjectId(); 
        const absence = new Attendance({ labId , absenceList: [{ studentId }] });
        const savedAbsence = await absence.save();

        // The saved document should have both 'createdAt' and 'updatedAt' fields
        expect(savedAbsence).to.have.property('createdAt');
        expect(savedAbsence).to.have.property('updatedAt');
    });
});