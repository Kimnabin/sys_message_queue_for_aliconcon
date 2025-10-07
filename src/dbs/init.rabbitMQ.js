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

const consumerQueue = async ( channel, queue ) => {
    try {
        await channel.assertQueue(queue, { durable: true });
        console.log(`Waiting for messages in ${queue}`);
        channel.consume( queue, (msg) => {
            console.log(`Received message: ${msg.content.toString()}`); 
            // 1. find user folowing the shop
            // 2. send message to user
            // 3. yes. ok => success
            // 4. error => setup DLX ( dead letter exchange )
        }, {
            noAck: true         // Auto acknowledgment of messages
        });
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
}

module.exports = { 
    connectToRabbitMQ, 
    connectToRabbitMQForTest,
    consumerQueue
};
