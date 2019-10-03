"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var merge_1 = tslib_1.__importDefault(require("lodash/merge"));
var cache_1 = require("./cache");
var is_promise_1 = tslib_1.__importDefault(require("./is-promise"));
var timeout_1 = tslib_1.__importDefault(require("./timeout"));
var RequestSender = (function () {
    function RequestSender(_requestFactory, _payloadTransformer, _cookie, _options) {
        if (_options === void 0) { _options = {}; }
        this._requestFactory = _requestFactory;
        this._payloadTransformer = _payloadTransformer;
        this._cookie = _cookie;
        this._options = _options;
        this._cache = this._options.cache || new cache_1.DefaultCache();
    }
    RequestSender.prototype.sendRequest = function (url, options) {
        var _this = this;
        var requestOptions = this._mergeDefaultOptions(options);
        var cachedRequest = this._getCachedRequest(url, requestOptions);
        if (cachedRequest) {
            return Promise.resolve(cachedRequest);
        }
        var request = this._requestFactory.createRequest(this._prependHost(url), requestOptions);
        return new Promise(function (resolve, reject) {
            var requestHandler = function () {
                var response = _this._payloadTransformer.toResponse(request);
                if (response.status >= 200 && response.status < 300) {
                    _this._cacheRequest(url, requestOptions, response);
                    resolve(response);
                }
                else {
                    reject(response);
                }
            };
            request.onload = requestHandler;
            request.onerror = requestHandler;
            request.onabort = requestHandler;
            request.ontimeout = requestHandler;
            if (requestOptions.timeout instanceof timeout_1.default) {
                requestOptions.timeout.onComplete(function () { return request.abort(); });
                requestOptions.timeout.start();
            }
            if (is_promise_1.default(requestOptions.timeout)) {
                requestOptions.timeout.then(function () { return request.abort(); });
            }
            request.send(_this._payloadTransformer.toRequestBody(requestOptions));
        });
    };
    RequestSender.prototype.get = function (url, options) {
        return this.sendRequest(url, tslib_1.__assign({}, options, { method: 'GET' }));
    };
    RequestSender.prototype.post = function (url, options) {
        return this.sendRequest(url, tslib_1.__assign({}, options, { method: 'POST' }));
    };
    RequestSender.prototype.put = function (url, options) {
        return this.sendRequest(url, tslib_1.__assign({}, options, { method: 'PUT' }));
    };
    RequestSender.prototype.patch = function (url, options) {
        return this.sendRequest(url, tslib_1.__assign({}, options, { method: 'PATCH' }));
    };
    RequestSender.prototype.delete = function (url, options) {
        return this.sendRequest(url, tslib_1.__assign({}, options, { method: 'DELETE' }));
    };
    RequestSender.prototype._mergeDefaultOptions = function (options) {
        var defaultOptions = {
            credentials: true,
            headers: {
                Accept: 'application/json, text/plain, */*',
            },
            method: 'GET',
        };
        var csrfToken = this._cookie.get('XSRF-TOKEN');
        if (csrfToken && defaultOptions.headers) {
            defaultOptions.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        if (options && options.body && defaultOptions.headers) {
            defaultOptions.headers['Content-Type'] = 'application/json';
        }
        return merge_1.default({}, defaultOptions, options);
    };
    RequestSender.prototype._prependHost = function (url) {
        if (!this._options.host || /^https?:\/\//.test(url)) {
            return url;
        }
        return this._options.host.replace(/\/$/, '') + "/" + url.replace(/^\//, '');
    };
    RequestSender.prototype._shouldCacheRequest = function (options) {
        var method = options.method || 'GET';
        return method.toUpperCase() === 'GET' && options.cache;
    };
    RequestSender.prototype._getCachedRequest = function (url, options) {
        if (this._shouldCacheRequest(options)) {
            return this._cache.read(url, options);
        }
        return null;
    };
    RequestSender.prototype._cacheRequest = function (url, options, response) {
        if (this._shouldCacheRequest(options)) {
            this._cache.write(url, options, response);
        }
    };
    return RequestSender;
}());
exports.default = RequestSender;
//# sourceMappingURL=request-sender.js.map