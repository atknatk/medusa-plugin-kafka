
# medusa-plugin-kafka

**Warning:** This plugin is currently under development and may be unstable.

`medusa-plugin-kafka` is a Kafka integration plugin for MedusaJS. This plugin connects to specified Kafka brokers and forwards events triggered in the MedusaJS application to configured Kafka topics, allowing real-time integration of your e-commerce platform with other systems.

## Features

- **Customizable Topic Prefixes**: Define prefixes for topics to help categorize and route messages appropriately.
- **Event Subscription**: Subscribe to specific or all Medusa events and configure individual processing rules for each.
- **Data Transformation**: Transform event data before sending it to Kafka, ensuring that only relevant information is forwarded.

## Installation

To install the plugin, navigate to your MedusaJS project directory and run the following command:

```bash
npm install medusa-plugin-kafka
```

## Configuration

Add the following configuration to your `medusa-config.js` to integrate the Kafka plugin with your Medusa store:

```javascript
{
  resolve: "medusa-plugin-kafka",
  options: {
    brokers: ['127.0.0.1:9092'], // List of Kafka brokers
    topicPrefix: 'prefix', // Prefix for Kafka topics
    subscribeAll: true, // Subscribe to all Medusa events
    events: {
      'product.created': {
        ignorePrefix: true,
        topic: 'product-update',
        transform: (document) => {
          return document;
        }
      },
      'product.updated': {
        ignorePrefix: true,
        topic: 'product-update',
        transform: async (document, container) => {
          /** @type {import('@medusajs/medusa').ProductService} */
          const productService = container.resolve('productService');
          const productFromDb = await productService.retrieve(data.id, {
            relations: [
              "variants",
              "variants.prices",
              "variants.options",
              "images",
              "options",
              "tags",
              "type",
              "collection",
              "categories",
              "categories.category_children",
              "categories.parent_category"
            ],
          });
          const { id, name, description, handle, is_active, category_children, products, metadata } = document;
          const result = {
            id,
            name,
            description,
            handle,
            is_active,
            category_children,
            products,
            metadata
          };
          return result;
        }
      }
      // Add other events as needed
    }
  }
}
```

## Usage

Once configured, the plugin will automatically start listening for the configured events and send the transformed data to the specified Kafka topics. Ensure that your Kafka instance is running and accessible from your Medusa server.

## Development and Testing

This plugin is currently in beta. Developers are encouraged to contribute to testing and enhancing its functionality. Please report any issues or contribute suggestions via GitHub issues.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change. Ensure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

For more details on event integration, visit the [Medusa Event Documentation](https://docs.medusajs.com/development/events/events-list).
