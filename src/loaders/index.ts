import { MedusaContainer } from "@medusajs/modules-sdk"
import { Logger } from "@medusajs/medusa"
import KafkaService from "../services/kafka"
import { PluginOptions } from "../types"

export default async (
  container: MedusaContainer,
  options: PluginOptions
) => {
  const logger: Logger = container.resolve("logger")

  try {
    const kafkaService: KafkaService =  container.resolve("kafkaService")
    logger.info('Loading Kafka Service');
    kafkaService.setLogger(logger);
    kafkaService.setSettings(options);
    kafkaService.run();
  } catch (err) {
    // ignore
    logger.warn(err)
  }
}
