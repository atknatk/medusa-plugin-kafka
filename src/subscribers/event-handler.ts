// Imports necessary types and services from Medusa and other local modules.
import { 
    type SubscriberConfig, 
    type SubscriberArgs,
    ProductService, 
  } from "@medusajs/medusa";
import KafkaService from "../services/kafka";
import { transformProduct } from "../utils/transformer";

// Defines the event handler function for various product events.
export const eventHandler = async (args: SubscriberArgs) => {
  // Destructures necessary data from args.
  const { data, eventName, container } = args;
  // Resolves the KafkaService from the dependency injection container.
  const kafkaService: KafkaService = container.resolve("kafkaService");
  let message = data;
  // Checks if the event is one of the specified product lifecycle events.
  if(eventName == ProductService.Events.UPDATED || eventName == ProductService.Events.DELETED || eventName == ProductService.Events.CREATED){
    // Transforms the product data into a suitable format before sending.
    message = transformProduct(data);
  }
  // Logs the event and its data for debugging purposes.
  console.log(`Handling event: ${eventName} with data: ${JSON.stringify(message)}`);
  // Sends the transformed message to Kafka.
  kafkaService.sendMessage(eventName, message, container);
};

// Factory function to create a configuration for subscribing to a specific event.
export const createSubscriberConfig = (eventName: string): SubscriberConfig => ({
  event: eventName,
  // Context to uniquely identify the subscriber.
  context: {
    subscriberId: `kafka-${eventName}-handler`,
  },
});
