export default class RefreshTokenHelper {
    constructor(client) {
        this._client = client;
        this._isRefreshing = false;
        this._subscribers = [];
        this._errorSubscribers = [];
        this._whitelist = [
            '/oauth/token'
        ];
    }

    /**
     * Subscribe a new callback to the cache queue
     *
     * @param {Function} [callback = () => {}]
     * @param {Function} [errorCallback = () => {}]
     */
    subscribe(callback = () => {}, errorCallback = () => {}) {
        this._subscribers.push(callback);
        this._errorSubscribers.push(errorCallback);
    }

    /**
     * Event handler which will be fired when the token got refresh. It iterates over the registered
     * subscribers and fires the callbacks with the new token.
     *
     * @param {String} token - Renewed access token
     */
    onRefreshToken(token) {
        this._client.token = token;
        this._client.defaults.headers.Authorization = `Bearer ${token.access_token}`;
        this._subscribers = this._subscribers.reduce((accumulator, callback) => {
            callback.call(null, token.access_token);
            return accumulator;
        }, []);
        this._errorSubscribers = [];
    }

    /**
     * Event handler which will be fired when the refresh token couldn't be fetched from the API
     *
     * @param {Error} err
     */
    onRefreshTokenFailed(err) {
        this._errorSubscribers = this._errorSubscribers.reduce((accumulator, callback) => {
            callback.call(null, err);
            return accumulator;
        }, []);
        this._subscribers = [];
    }

    /**
     * Fires the refresh token request and renews the bearer authentication in the login service.
     *
     * @returns {Promise<String>}
     */
    fireRefreshTokenRequest() {
        this.isRefreshing = true;

        return this._client.post(`${this._client.defaultUrl}/api/oauth/token`, {
            grant_type: 'refresh_token',
            client_id: 'administration',
            scopes: 'write',
            refresh_token: this._client.token.refresh_token
        }).then((res) => {
            this.onRefreshToken(res.data);
        }).finally(() => {
            this.isRefreshing = false;
        }).catch((err) => {
            this.onRefreshTokenFailed();
            return Promise.reject(err);
        });
    }

    get whitelist() {
        return this._whitelist;
    }

    set whitelist(urls) {
        this._whitelists = urls;
    }

    get isRefreshing() {
        return this._isRefreshing;
    }

    set isRefreshing(value) {
        this._isRefreshing = value;
    }
}
