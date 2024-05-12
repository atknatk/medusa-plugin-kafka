
    // This file is auto-generated. Do not modify directly.

    import { 
        type SubscriberConfig, 
        type SubscriberArgs,
    } from "@medusajs/medusa"
    import { eventHandler } from "../event-handler"
    
    export default async (args: SubscriberArgs) => eventHandler(args);


    export const config: SubscriberConfig = {
        event: 'claim.shipment_created',
        context: {
        subscriberId: "kafka-claim-shipment-created",
        },
    }

