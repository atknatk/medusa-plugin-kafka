import { ProductCategoryService, ProductService } from "@medusajs/medusa";

export type EventKeys = keyof typeof ProductService.Events & keyof typeof ProductCategoryService.Events;

export const kafkaErrorCodes = {
  TOPIC_NOT_FOUND: "topic_not_found",
}

export interface KafkaPluginOptions {
  brokers: string[],
  
  /**
   * Kafka client configuration
   */
  events: Config;

  topicPrefix?: string;

  subscribeAll?: boolean;

}


type Config =  {
  [Key in EventKeys]: boolean | KafkaEventConfig; 
}

export type KafkaEventConfig =  {
   ignorePrefix?: boolean;
   topic?: string; 
   transform: (original) => any; 
}