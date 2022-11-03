import {createClient} from './client.js';
import EntityDefinition from './factory/entity-definition.factory.js';
import EntityHydrator from './data/entity-hydrator.data.js';
import ChangesetGenerator from './data/changeset-generator.data.js';
import EntityFactory from './data/entity-factory.data.js';
import Repository from './data/repository.data.js';

export default class Api {
    constructor(url, token, version) {
        this.url = url;
        this.client = createClient(url, token, version)
        this.version = version;
        this.schema = require('./data/schema.json')
    }

    async _initialize() {

        this.EntityDefinition = EntityDefinition;
        
        Object.keys(this.schema).forEach((entityName) => {
            this.EntityDefinition.add(entityName, this.schema[entityName]);
        });

        const hydrator = new EntityHydrator(this.EntityDefinition);
        const changesetGenerator = new ChangesetGenerator(this.EntityDefinition);
        const entityFactory = new EntityFactory();

        this.create = (entityName, route, options) => {
            if (!route) {
                route = `/${entityName.replace(/_/g, '-')}`;
            }
            options = options || {};

            if (options.version === undefined) {
                options.version = this.version;
            }

            const definition = this.EntityDefinition.get(entityName);

            return new Repository(
                route,
                entityName,
                this.client,
                hydrator,
                changesetGenerator,
                entityFactory,
                options
            );
        };
    }

    defaultContext() {
        return {
            apiPath: `${this.url}/api`,
            apiResourcePath: `${this.url}/api/v${this.version}`,
            apiVersion: this.version,
            authToken: {
                access: this.client.token.access_token
            }
        }
    }
}