# Admin Node-API Client for Shopware 6

This code highly bases on the [Administration Code](https://github.com/shopware/platform/tree/745f1f7aaa5c47d123e04b5b5b93b81161eae19a/src/Administration/Resources/app/administration/src/core/data-new) and made NodeJs compatible.

## Creation of API Client

### Using Username and Password

```js
import {createFromPasswordAndLogin} from 'shopware-admin-api';

let api = await createFromPasswordAndLogin('http://myshop.com', 'username', 'password', 1);
```

### Using Integration

```js
import {createFromIntegration} from 'shopware-admin-api';

let api = await createFromIntegration('http://myshop.com', 'client_id', 'client_secret', 1);
```


## Usage

```js
// Create repository
const productRepository = api.create('product');

// Access default context
const context = api.defaultContext();

// Acccess entity definition (contains the schema, required fields etc.)
const definition = api.EntityDefinition;

console.log(definition.get('product'))
console.log(definition.getRequiredFields('product'))
```

## License

[MIT](LICENSE.md)