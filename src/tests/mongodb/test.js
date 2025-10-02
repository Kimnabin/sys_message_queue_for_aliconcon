'use strict';

const { before } = require('lodash');
const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27018/shopDev';

const TestSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const TestModel = mongoose.model('Test', TestSchema);

describe('MongoDB Connection Test', () => {
    let connection;

    beforeAll(async () => {
        connection = await mongoose.connect(connectString);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should connect to MongoDB and perform a simple operation', async () => {
        expect(mongoose.connection.readyState).toBe(1); // 1 means connected
    });

    test('should create and retrieve a document', async () => {
        const user = new TestModel({ name: 'John Doe', age: 30 });
        await user.save();
        expect(user.isNew).toBe(false);    
    });

    test('should find the document in the database', async () => {
        const user = await TestModel.findOne({ name: 'John Doe' });
        expect(user).toBeDefined();
        expect(user.name).toBe('John Doe');
        expect(user.age).toBe(30);
    });
});