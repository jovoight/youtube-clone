const projectId = 'yt-clone-4249d';
const subscriptionId = 'video-uploads-subscription';

// Imports the Google Cloud client library
import {PubSub, Message} from '@google-cloud/pubsub';
import { processVideoFromMessage } from './process';

// Instantiate the client
const pubSubClient = new PubSub({projectId});

const listenForMessages = () => {
  // Instantiate the subscription
  const subscription = pubSubClient.subscription(subscriptionId);
  console.log(`Listening for messages on ${subscriptionId}`);
  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message: Message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    // Process the video
    processVideoFromMessage(message);
    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };
  // Listen for new messages
  subscription.on('message', messageHandler);
}
// Listen for messages (set timeout to 23hr, run every 24hr at 3AM on Cloud Scheduler)
listenForMessages();