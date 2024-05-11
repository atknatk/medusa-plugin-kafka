import { SearchTypes } from "@medusajs/types"
import { SearchUtils } from "@medusajs/utils"
import { Kafka } from "kafkajs"
import { EventKeys, kafkaErrorCodes, KafkaPluginOptions } from "../types"
import { transformProduct } from "./utils/transformer"
import { Logger } from "@medusajs/medusa"


class KafkaService {
  setLogger(logger: Logger) {
    this.logger_ = logger;
  }
  

  protected config_: KafkaPluginOptions
  protected client_: Kafka
  protected logger_: Logger

  constructor() {
 

  }

  setSettings(options: KafkaPluginOptions){

    this.config_ = options

    // if (process.env.NODE_ENV !== "development") {
    //   if (!options.config?.apiKey) {
    //     throw Error(
    //       "Meilisearch API key is missing in plugin config. See https://docs.medusajs.com/add-plugins/meilisearch"
    //     )
    //   }
    // }

    // if (!(options.configs?.length > 0)) {
    //   throw Error(
    //     "Meilisearch configs is missing"
    //   )
    // }


    if (!(options.brokers?.length > 0)) {
      throw Error(
        "Meilisearch brokers is missing"
      )
    }

    this.client_ = new Kafka({
      clientId: 'medusa-kafka-client',
      brokers : options.brokers
    })

  }

  // getTransformedDocuments(type: string, documents: any[]) {
  //   if (!documents?.length) {
  //     return []
  //   }

  //   switch (type) {
  //     case SearchTypes.indexTypes.PRODUCTS:
  //       const productsTransformer =
  //         this.config_.settings?.[SearchTypes.indexTypes.PRODUCTS]
  //           ?.transformer ?? transformProduct

  //       return documents.map(productsTransformer)
  //     default:
  //       return documents
  //   }
  // }


  private getConfig(eventName: string) : {isActive : boolean , topicName : string, transform : (original)=> any}{
    let isActive : boolean = this.config_.subscribeAll ?? true;
    let topicName : string = (this.config_.topicPrefix ?? '') + eventName;
    let transform;
    const eventConfig = this.config_.events[eventName];  
    if (typeof eventConfig == "boolean") {
        isActive = eventConfig;
    }else if (eventConfig?.transform){
      isActive = true;
      transform = eventConfig?.transform;
      topicName = (eventConfig.ignorePrefix ? '' : (this.config_.topicPrefix ?? '')) + (eventConfig.topic ?? eventName)
    }else{
      topicName = (this.config_.topicPrefix ?? '') +  eventName;
    }
    return{
      isActive,
      topicName,
      transform
    }
  }


  async sendMessage(eventName: string, message: unknown) {
    const config = this.getConfig(eventName);
    if(!config.isActive){
        return
    }
     await this.client_.producer().send({
      topic: config.topicName,
      messages: [
        { value: JSON.stringify(config.transform ? config.transform(message): message) },
      ],
    })
  }

  async run () {
    await this.client_.producer().connect()
  }

}

export default KafkaService
