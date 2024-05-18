import { MedusaContainer, ProductCategoryService, ProductService, ProductVariantService } from "@medusajs/medusa";
import { Message, logLevel } from "kafkajs";

export type EventKeys = keyof typeof ProductService.Events & 
                        keyof typeof ProductCategoryService.Events & 
                        keyof typeof ProductVariantService.Events;

export const kafkaErrorCodes = {
  TOPIC_NOT_FOUND: "topic_not_found",
}

export interface PluginOptions {
  brokers: string[],
  logLevel?: logLevel,
  
  /**
   * Kafka client configuration
   */
  events?: Config;
  merge?: MergeConfig[];

  topicPrefix?: string;

  subscribeAll?: boolean;

}


type Config =  {
  [Key in EventKeys]: boolean | KafkaEventConfig; 
}

type KafkaEventConfigKey =  {
  [records in any]: KafkaEventConfig; 
}

export type KafkaEventConfig =  {
   ignorePrefix?: boolean;
   topic?: string; 
   bulk?: boolean; 
   transform: (original, container: MedusaContainer) => Message;
}

export type MergeConfig =  {
  ignorePrefix?: boolean;
  topic: string; 
  events:  KafkaEventConfigKey ;
}