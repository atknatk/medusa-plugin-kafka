// Importing necessary types and utilities from Medusa, KafkaJS, and local types.
import { Logger, MedusaContainer } from "@medusajs/medusa";
import { Kafka, logLevel } from "kafkajs";
import { PluginOptions } from "../types";

// Defines the KafkaService class for handling Kafka-related operations.
class KafkaService {
  // Variables for storing configuration, Kafka client, and logger.
  protected config_: PluginOptions;
  protected client_: Kafka;
  protected logger_: Logger;

  // Empty constructor as initialization is done through setSettings.
  constructor() {}

  // Sets the logger to be used by the KafkaService.
  setLogger(logger: Logger) {
    this.logger_ = logger;
  }

  // Configures the KafkaService with options provided.
  setSettings(options: PluginOptions) {
    this.config_ = options;

    // Check if the brokers list is provided.
    if (!(options.brokers?.length > 0)) {
      throw new Error("Kafka broker list is missing");
    }

    // Creates a new Kafka client with specified options.
    this.client_ = new Kafka({
      clientId: 'medusa-kafka-client',
      brokers: options.brokers,
      enforceRequestTimeout: true,
      logLevel: options.logLevel ?  options.logLevel : logLevel.NOTHING,
      retry: {
        retries: 3
      }
    });
  }

  // Retrieves the configuration for a specific event.
  private getConfig(eventName: string) : {isActive : boolean, topicName : string, transform : (original, container: MedusaContainer) => unknown} {
    let isActive : boolean = this.config_.subscribeAll ?? true;
    let topicName : string = (this.config_.topicPrefix ?? '') + eventName;
    let transform;

    // Checks if there is a specific configuration for the event.
    const eventConfig = this.config_.events ? this.config_.events[eventName] : undefined;
    if (typeof eventConfig == "boolean") {
      isActive = eventConfig;
    } else if (eventConfig?.transform) {
      isActive = true;
      transform = eventConfig.transform;
      topicName = (eventConfig.ignorePrefix ? '' : (this.config_.topicPrefix ?? '')) + (eventConfig.topic ?? eventName)
    } else {
      topicName = (this.config_.topicPrefix ?? '') + eventName;
    }

    return {
      isActive,
      topicName,
      transform
    };
  }

  // Sends a message to a Kafka topic based on the event configuration.
  async sendMessage(eventName: string, message: unknown, container: MedusaContainer) {
    const config = this.getConfig(eventName);
    if (!config.isActive) {
      return;
    }
    this.logger_.info(`Kafka -> eventName: ${eventName}, topicName: ${config.topicName}, message: ${JSON.stringify(message)}`);
    
    // Connects to Kafka and sends the message.
    const producer = this.client_.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 10000,
    });
    await producer.connect();
    await producer.send({
      topic: config.topicName,
      messages: [
        { value: JSON.stringify(config.transform ? (await config.transform(message, container)) : message) },
      ],
    });
    await producer.disconnect();
  }

  // Placeholder for running any necessary startup logic for Kafka producer.
  async run () {
    // Placeholder for potential future use.
  }

}

// Exports the KafkaService for use elsewhere in the application.
export default KafkaService
