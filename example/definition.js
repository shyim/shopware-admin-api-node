import {createFromPasswordAndLogin} from '../src/index.js';

async function test()
{
    let api = await createFromPasswordAndLogin('<url>', 'demo', 'demo', 1);
    
    console.log(api.EntityDefinition.getRequiredFields('product'));
} 

test();