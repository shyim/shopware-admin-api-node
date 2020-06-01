import axios from 'axios';
import Api from './api.js';
export {default as Criteria} from './data/criteria.data.js';

export async function createFromPasswordAndLogin(url, username, password, version) {
    version = version || 1;
    let res;

    try {
        res = await axios.post(`${url}/api/oauth/token`, {
            client_id: "administration",
            grant_type: "password",
            scopes: "write",
            username: username,
            password: password
        });
    } catch(err) {
        if (err.response && err.response.status === 401) {
            throw new Error('Invalid credentials');
        }

        throw err;
    }

    let api = new Api(url, res.data, version);
    await api._initialize();

    return api;
};


export async function createFromIntegration(url, id, secret, version) {
    version = version || 1;
    let res;

    try {
        res = await axios.post(`${url}/api/oauth/token`, {
            client_id: id,
            grant_type: "client_credentials",
            client_id: id,
            client_secret: secret
        });
    } catch(err) {
        if (err.response.status === 401) {
            throw new Error('Invalid credentials');
        }

        throw err;
    }

    let api = new Api(url, res.data, version);
    await api._initialize();

    return api;
}