'use strict';

const { connectToRabbitMQForTest } = require('../../dbs/init.rabbitMQ');

describe('RabbitMQ Connection Test', () => {
    test('should connect to RabbitMQ and send a test message', async () => {
        const result = await connectToRabbitMQForTest();
        expect(result).toBeUndefined(); // The function does not return anything
    });
});