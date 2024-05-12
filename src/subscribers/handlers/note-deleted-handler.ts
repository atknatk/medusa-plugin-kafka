
    // This file is auto-generated. Do not modify directly.

    import { 
        type SubscriberConfig, 
        type SubscriberArgs,
    } from "@medusajs/medusa"
    import { eventHandler } from "../event-handler"
    
    export default async (args: SubscriberArgs) => eventHandler(args);


    export const config: SubscriberConfig = {
        event: 'note.deleted',
        context: {
        subscriberId: "kafka-note-deleted",
        },
    }

