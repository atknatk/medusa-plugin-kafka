import { 
    ProductService,
    type SubscriberConfig, 
    type SubscriberArgs,
    type ConfigModule, 
  } from "@medusajs/medusa"
import KafkaService from "src/services/kafka"
  
  export default async function productUpdateHandler({ 
    data, eventName, container, pluginOptions, 
  }: SubscriberArgs) {
    // const configModule: ConfigModule = container.resolve(
    //   "configModule"
    // )
    const kafkaService: KafkaService =  container.resolve("kafkaService")
    console.log('kafkaService', kafkaService)

    kafkaService.sendMessage(eventName, data);

  }
  
  export const config: SubscriberConfig = {
    event: ProductService.Events.UPDATED,
    context: {
      subscriberId: "kafka-product-update-handler",
    },
  }