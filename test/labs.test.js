const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);


const Lab = require('../models/labs');

describe('Lab Schema Tests', function () {
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

    // Test for required fields
    it('should require all fields', async function () {
        const lab = new Lab({});
        // Expect saving an empty Lab to be rejected due to missing required fields
        await expect(lab.save()).to.be.rejectedWith(mongoose.Error.ValidationError);
    });

    // Test to ensure labName, labLocation, and labType fields are of type string
    it('should have strings for labName, labLocation, and labType', async function () {
        const lab = new Lab({
            labName: 'Lab 1',
            labDate: new Date(),
            labLocation: 'Building 5',
            labCapacity: 30,
            labType: 'Computer',
            instructor: new mongoose.Types.ObjectId()
        });
        // Verify the type of each field matches the schema definition
        expect(lab.labName).to.be.a('string');
        expect(lab.labLocation).to.be.a('string');
        expect(lab.labType).to.be.a('string');
        // Expect the document to be saved successfully
        await expect(lab.save()).to.be.fulfilled;
    });

    // Test for the labDate field to be of type Date
    it('should have a date for labDate', async function () {
        const lab = new Lab({
            labName: 'Lab 1',
            labDate: new Date(),
            labLocation: 'Building 5',
            labCapacity: 30,
            labType: 'Computer',
            instructor: new mongoose.Types.ObjectId()
        });
        // Check that labDate is correctly recognized as a Date object
        expect(lab.labDate).to.be.a('date');
        await expect(lab.save()).to.be.fulfilled;
    });

    // Test for labCapacity to be a number
    it('should have a number for labCapacity', async function () {
        const lab = new Lab({
            labName: 'Lab 1',
            labDate: new Date(),
            labLocation: 'Building 5',
            labCapacity: 30,
            labType: 'Computer',
            instructor: new mongoose.Types.ObjectId()
        });
        // Verify labCapacity is stored as a number
        expect(lab.labCapacity).to.be.a('number');
        await expect(lab.save()).to.be.fulfilled;
    });

    // Test for instructor to reference a valid ObjectId
    it('should reference a user ObjectId for instructor', async function () {
        const lab = new Lab({
            labName: 'Lab 1',
            labDate: new Date(),
            labLocation: 'Building 5',
            labCapacity: 30,
            labType: 'Computer',
            instructor: new mongoose.Types.ObjectId()
        });
        // Validate that the instructor field contains a valid ObjectId
        expect(lab.instructor).to.satisfy(mongoose.Types.ObjectId.isValid);
        await expect(lab.save()).to.be.fulfilled;
    });

    // Test to ensure that timestamps are automatically added to each document
    it('should automatically add timestamps', async function () {
        const lab = new Lab({
            labName: 'Lab 1',
            labDate: new Date(),
            labLocation: 'Building 5',
            labCapacity: 30,
            labType: 'Computer',
            instructor: new mongoose.Types.ObjectId()
        });
        const savedLab = await lab.save();
        // Check that mongoose automatically adds createdAt and updatedAt fields
        expect(savedLab).to.have.property('createdAt');
        expect(savedLab).to.have.property('updatedAt');
    });

});
