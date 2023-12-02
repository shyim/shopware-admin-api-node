import RefreshTokenHelper from './utils/refresh-token.helper.js';
import axios from 'axios';

export function createClient(url, token, version) {
    const client = axios.create({
        baseURL: `${url}/api`
    })

    client.defaultUrl = url;
    client.token = token;

    client.defaults.headers.Authorization = `Bearer ${token.access_token}`;

    refreshTokenInterceptor(client);

    return client;
}

function refreshTokenInterceptor(client) {
    const tokenHandler = new RefreshTokenHelper(client);

    client.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        const { config, response: { status } } = error;
        const originalRequest = config;
        const resource = originalRequest.url.replace(originalRequest.baseURL, '');

        if (tokenHandler.whitelist.includes(resource)) {
            return Promise.reject(error);
        }

        if (status === 401) {
            if (!tokenHandler.isRefreshing) {
                tokenHandler.fireRefreshTokenRequest().catch(() => {
                    return Promise.reject(error);
                });
            }

            return new Promise((resolve, reject) => {
                tokenHandler.subscribe((newToken) => {
                    // replace the expired token and retry
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    originalRequest.url = originalRequest.url.replace(originalRequest.baseURL, '');
                    resolve(Axios(originalRequest));
                }, (err) => {
                    reject(err);
                });
            });
        }

        return Promise.reject(error);
    });
}