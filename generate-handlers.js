const fs = require('fs');
const path = require('path');

const kafkaEvents = require('./src/subscribers/events').default;

// Event listesi, burayı istediğiniz event'larla doldurun.

// Dosyaların oluşturulacağı dizin
const outputDir = path.join(__dirname, 'src/subscribers/handlers');

// Dizin yoksa oluştur
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

kafkaEvents.forEach(event => {
    const eventName =  event.toLowerCase().replace(/[,_\.-]/g, '-');
  const content = `
    // This file is auto-generated. Do not modify directly.

    import { 
        type SubscriberConfig, 
        type SubscriberArgs,
    } from "@medusajs/medusa"
    import { eventHandler } from "../event-handler"
    
    export default async (args: SubscriberArgs) => eventHandler(args);


    export const config: SubscriberConfig = {
        event: '${event}',
        context: {
        subscriberId: "kafka-${eventName}",
        },
    }

`;

  const fileName = `${eventName}-handler.ts`;
  const filePath = path.join(outputDir, fileName);

  fs.writeFileSync(filePath, content);
  console.log(`Handler for ${event} created: ${filePath}`);
});

console.log('All handlers have been created successfully.');
