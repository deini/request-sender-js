import RequestOptions from './request-options';
import Response from './response';
export default interface Cache {
    read<T>(url: string, options: RequestOptions): Response<T> | null;
    write<T>(url: string, options: RequestOptions, response: Response<T>): void;
}
export declare class DefaultCache implements Cache {
    private _cache;
    read<T>(url: string, options: RequestOptions): Response<T> | null;
    write<T>(url: string, options: RequestOptions, response: Response<T>): void;
    private getKey;
}
