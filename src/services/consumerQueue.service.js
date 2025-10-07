'use strict';

const { consumerQueue, connectToRabbitMQ } = require('../dbs/init.rabbitMQ');

const messageService = {
    consumerToQueue: async (queue) => {
        try {
            const { connection, channel } = await connectToRabbitMQ();
            await consumerQueue(channel, queue);
        } catch (error) {
            console.error('Error in messageService:', error);
        }
    },

    // case processing 
    consumerToQueueNormal: async (queue) => {
        try {
            const { channel, connection } = await connectToRabbitMQ();
            const notiQueue = 'notification_queue_process';
            // TTL
            // const timeProcess = 15000; // thoi gian xu ly message la 15s
            // setTimeout(() => {
            //     channel.consume( notiQueue, (msg) => {
            //     console.log(`Received message: ${msg.content.toString()}`);
            //     channel.ack(msg);  // Xác nhận đã xử lý thành công
            // });
            // }, timeProcess);

            // LOGIC
            await channel.consume( notiQueue, (msg) => { 
                try {
                    const numberTest = Math.random();
                console.log(`Random number: ${numberTest}`);
                if (numberTest < 0.8) {
                    throw new Error('Send notification failed, please try again later!');
                }

                console.log(`Received message: ${msg.content.toString()}`);
                channel.ack(msg);  // Xác nhận đã xử lý thành công
                } catch (error) {
                    console.error('SEND notification error:: ', error);
                    channel.nack(msg, false, false); // Gửi lại message vào DLX (nếu có) hoặc loại bỏ nó
                    /**
                     * channel.nack(msg, false, false);
                     * - msg: Tin nhắn mà bạn muốn từ chối (nack).
                     * - false: Chỉ định rằng bạn không muốn từ chối nhiều tin nhắn cùng một lúc.
                     * - false: Chỉ định rằng bạn không muốn gửi lại tin nhắn vào hàng đợi (nếu có DLX, nó sẽ được gửi đến DLX).
                     */
                }
            });
        } catch (error) {
            console.error('Error in consumerToQueueNormal:', error);
        }
    },

    // case DLX
    consumerToQueueFail: async (queue) => {
        try {
            const { channel, connection } = await connectToRabbitMQ();
            const notificationRoutingKeyDLX = 'notification_routing_key_dlx';
            const notificationExchangeDLX = 'notification_exchange_dlx';
            const notiQueueHandler = 'notificationQueueHotFix';

            // create DLX exchange
            await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true });

            const queueResult = await channel.assertQueue(notiQueueHandler, { exclusive: false });

            // bind queue to exchange
            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);
            await channel.consume( queueResult.queue, (msgFailed) => {
                console.log(`Received message in DLX handler: ${msgFailed.content.toString()}!! please hot fix now`);
                channel.ack(msgFailed);  // Xác nhận đã xử lý thành công
            });
        } catch (error) {
            console.error('Error in consumerToQueueFail:', error);
        }
    }
    
}

module.exports = messageService;