'use strict';
require('dotenv').config();
const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        return { connection, channel };
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { connection, channel } = await connectToRabbitMQ();

        // push meessage to test-queue
        const queue = 'test-queue';
        await channel.assertQueue(queue, { durable: true });
        const message = 'hello everyone, this is a message from RabbitMQ';
        channel.sendToQueue(queue, Buffer.from(message));
        await channel.close();
    } catch (error) {
        console.error('Error connecting to RabbitMQ for test:', error);
        throw error;
    }
}

module.exports = { 
    connectToRabbitMQ, 
    connectToRabbitMQForTest };
