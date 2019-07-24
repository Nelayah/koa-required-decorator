interface IOptions {
    errMsgFunc?: (errors: string[]) => string;
    responseFunc?: (params: string) => any;
}
interface IParams {
    [key: string]: string[];
}
export declare const setKoaRequiredOptions: (options: IOptions) => void;
declare const _default: (params: IParams) => (_: any, __: any, descriptor: any) => void;
export default _default;
