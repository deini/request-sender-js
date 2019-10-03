import { CookiesStatic } from 'js-cookie';
import PayloadTransformer from './payload-transformer';
import RequestFactory from './request-factory';
import RequestOptions from './request-options';
import RequestSenderOptions from './request-sender-options';
import Response from './response';
export default class RequestSender {
    private _requestFactory;
    private _payloadTransformer;
    private _cookie;
    private _options;
    private _cache;
    constructor(_requestFactory: RequestFactory, _payloadTransformer: PayloadTransformer, _cookie: CookiesStatic, _options?: RequestSenderOptions);
    sendRequest<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>;
    get<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>;
    post<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>;
    put<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>;
    patch<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>;
    delete<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>;
    private _mergeDefaultOptions;
    private _prependHost;
    private _shouldCacheRequest;
    private _getCachedRequest;
    private _cacheRequest;
}
