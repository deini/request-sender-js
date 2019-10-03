"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var queryString = tslib_1.__importStar(require("query-string"));
var DefaultCache = (function () {
    function DefaultCache() {
        this._cache = new Map();
    }
    DefaultCache.prototype.read = function (url, options) {
        var cacheKey = this.getKey(url, options.params);
        return this._cache.get(cacheKey) || null;
    };
    DefaultCache.prototype.write = function (url, options, response) {
        var cacheKey = this.getKey(url, options.params);
        this._cache.set(cacheKey, response);
    };
    DefaultCache.prototype.getKey = function (url, params) {
        if (params === void 0) { params = {}; }
        if (Object.keys(params).length === 0) {
            return url;
        }
        return url + "?" + queryString.stringify(params);
    };
    return DefaultCache;
}());
exports.DefaultCache = DefaultCache;
//# sourceMappingURL=cache.js.map