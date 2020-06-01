import {createFromPasswordAndLogin} from '../src/index.js';
import Criteria from '../src/data/criteria.data.js';

async function test()
{
    let api = await createFromPasswordAndLogin('<url>', 'demo', 'demo', 1);
    
    let repository = api.create('product');
    let criteria = new Criteria();
    criteria.addFilter(Criteria.equals('parentId', null));

    let products = await repository.search(criteria, api.defaultContext());

    const product = products[0];
    console.log(product.name);
    product.name = 'Node Test';
    console.log(product.name);

    await repository.save(products[0], api.defaultContext());
} 

test();