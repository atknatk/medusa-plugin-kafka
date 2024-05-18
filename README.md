
# medusa-plugin-kafka

**Warning:** This plugin is currently under development and may be unstable.

`medusa-plugin-kafka` is a Kafka integration plugin for MedusaJS. This plugin connects to specified Kafka brokers and forwards events triggered in the MedusaJS application to configured Kafka topics, allowing real-time integration of your e-commerce platform with other systems.


For more details on event integration, visit the [Medusa Event Documentation](https://docs.medusajs.com/development/events/events-list).


## Features

- **Customizable Topic Prefixes**: Define prefixes for topics to help categorize and route messages appropriately.
- **Event Subscription**: Subscribe to specific or all Medusa events and configure individual processing rules for each.
- **Data Transformation**: Transform event data before sending it to Kafka, ensuring that only relevant information is forwarded.
- **Merge Events**: Allows writing multiple events to the same topic. For example, product and product variant events can be written to the same topic. If `bulk` is true, all values are added individually to the topic instead of as an array.

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
  /** @type {import('medusa-plugin-kafka').PluginOptions} */
  options: {
    brokers: ['31.220.77.86:9092'], // List of Kafka brokers
    topicPrefix: 'prefix.', // Prefix for Kafka topics
    logLevel: 4, // Logging level
    subscribeAll: false, // Subscribe to all Medusa events
    merge: [
      {
        ignorePrefix: true,
        topic: 'store.product',
        events: {
          'product-variant.created': {
            transform: async (document, container) => await productVariantTransform(document, container)
          },
          'product-variant.updated': {
            transform: async (document, container) => await productVariantTransform(document, container)
          },
          'product.updated': {
            bulk: true,
            transform: async (document, container) => await productTransform(document, container)
          },
          'product.created': {
            bulk: true,
            transform: async (document, container) => await productTransform(document, container)
          }
          // .... other events
        }
      }
    ],
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

```


const  productTransform =async (document, container) => {
  let data = document;
  /** @type {import('@medusajs/medusa').ProductService} */
  const productService = container.resolve('productService');
  const rawData = await productService.retrieve(data.id, {
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
  data = { ...data, ...rawData };
  console.log('medusa-plugin-kafka', data);

  if(data.variants?.length > 0){
    const result = [];
      /** @type {import('@medusajs/medusa').ProductVariant} */
      for (const variant of data.variants) {
          const product = {...data};
          product.title = replaceTitle(product.title, variant.title);
          product.id = `${product.id}:${variant.id}`;
          result.push({key: product.id, value: JSON.stringify(mapFilters(product , variant))});
      }
      console.log('medusa-plugin-kafka - result ', result);
    return result;
  }else{
    console.log('medusa-plugin-kafka - result else ', { key: data.id, value: null });
    return { key: data.id, value: null };
  }
  
}



const mapFilters = (product, variant) => {
  product.filter = [];
  product.filterVariant = [];
  for (const key in product.metadata) {
    if (Object.hasOwnProperty.call(product.metadata, key)) {
      const value = product.metadata[key];
      product.filter.push({
        key,
        value
      })
    }
  }
  
  if(variant && variant.prices?.length > 0){
    const eur = variant.prices.filter(l => l.currency_code = 'eur');
    if(eur.length > 0){
      product.price = eur.amount;
    }
    
  }

  if(variant?.thumbnail){
    product.thumbnailVariant = variant.thumbnail;
  }

  if(variant && variant.options?.length > 0){
     for (const option of variant.options) {
      const filtered = product.options.filter(l => l.id = option.option_id);
      if(filtered.length > 0){
        product.filterVariant.push({
          key : filtered[0].title,
          value : option.value
        });
      }
     }
  }



  return product;
}


const replaceTitle = (productTitle, variantTitle) => {
  if(!variantTitle){
    return productTitle.replace('%s', '')
  }
  if(productTitle?.indexOf('%s') > -1){
    return productTitle.replace('%s', variantTitle)
  }
  return `${productTitle ?? ''} ${variantTitle}`;
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

