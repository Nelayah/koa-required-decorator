import * as R from 'ramda';

interface IOptions {
  errMsgFunc?: (errors: string[]) => string;
  responseFunc?: (params: string) => any;
}

interface IParams {
  [key: string]: string[]
}

const collectionFunc = (errors, obj, params) =>
  R.forEachObjIndexed((value: any, key: string) => {
    R.forEach(R.when((k: string) => R.isNil(R.path(key.split('.').concat(k))(obj)), k => errors.push(k)))(value)
  })(params);

const composeErrMsg = R.compose(
  R.join(' '),
  R.map(k => `parameter "${k}" should not be null.`)
);

let defaultOptions = {
  errMsgFunc: composeErrMsg,
  responseFunc: errMsg => {
    return ({
      errCode: 400000,
      errMsg
    })
  }
}

export const setKoaRequiredOptions = (options: IOptions) => {
  if (R.isNil(options) || R.isEmpty(options) || typeof options !== 'object') return;
  defaultOptions = { ...defaultOptions, ...options };
};

export default (params: IParams) => {
  return (_, __, descriptor) => {
    const fn = descriptor.value;
    descriptor.value = async (ctx, next) => {
      const errors = [];
      collectionFunc(errors, ctx, params);
      if (!R.isEmpty(errors)) {
        ctx.status = 400;
        return ctx.body = defaultOptions.responseFunc(defaultOptions.errMsgFunc(errors));
      }
      await fn(ctx, next);
    }
  }
}