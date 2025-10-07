"use strict";

require("dotenv").config();
const { consumerToQueue, consumerToQueueNormal, consumerToQueueFail } = require("./src/services/consumerQueue.service");
const queueName = process.env.QUEUE_NAME || "test-queue";

// consumerToQueue(queueName)
//   .then(() => {
//     console.log("Consumer service started");
//   })
//   .catch((err) => {
//     console.error("Error starting consumer service:", err);
//   });

// for normal case
consumerToQueueNormal(queueName)
  .then(() => {
    console.log("Consumer service for normal case started");
  })
  .catch((err) => {
    console.error("Error starting consumer service for normal case:", err);
  }); 

// for DLX case
consumerToQueueFail(queueName)
  .then(() => {
    console.log("Consumer service for DLX case started");
  })
  .catch((err) => {
    console.error("Error starting consumer service for DLX case:", err);
  });