import * as R from 'ramda';
import * as Koa from 'koa';
import * as superagent from 'superagent';
import * as KoaRouter from 'koa-router';
import Required, { setKoaRequiredOptions } from '../lib';

setKoaRequiredOptions({
  errMsgFunc: arr => arr.map(k => `参数 "${k}" 不能为空.`).join(' '),
  responseFunc: errMsg => {
    return ({
      code: 400001,
      msg: errMsg
    })
  }
});

const app = new Koa();
const router = new KoaRouter();
class Controller {
  @Required({
    query: ['id', 'name']
  })
  async getMethod(ctx, _) {
    ctx.body = 'GET success';
  }

  @Required({
    'request.fields': ['id', 'name']
  })
  async postMethod(ctx, _) {
    ctx.body = 'POST success';
  }

  getReq(url) {
    return new Promise(resolve => {
      superagent.get(`http://localhost:4000${url}`, (_, response) => {
        if (R.has('body')(response) && !R.isNil(response.body) && !R.isEmpty(response.body)) return resolve(response.body);
        resolve(response.text);
      })
    });
  }
  postReq(url) {
    return new Promise(resolve => {
      superagent.post(`http://localhost:4000${url}`, (_, response) => {
        if (R.has('body')(response) && !R.isNil(response.body) && !R.isEmpty(response.body)) return resolve(response.body);
        resolve(response.text);
      })
    });
  }
}
const ctrl = new Controller();
router.get('/demo1', ctrl.getMethod);
router.post('/demo2', async (ctx, next) => {
  ctx.request.fields = ctx.query;
  await next();
}, ctrl.postMethod);

app
  .use(router.routes())
  .use(router.allowedMethods());

let server;;

beforeAll(async done => {
  server = app.listen(4000);
  done();
});

afterAll(async done => {
  await server.close();
  done();
});

describe(`使用自定义配置,进行校验`, () => {
  it('能检测到 GET /demo1, id 和 name 不存在', async () => {
    const data = await ctrl.getReq('/demo1');
    expect(data).toStrictEqual({ "code": 400001, "msg": "参数 \"id\" 不能为空. 参数 \"name\" 不能为空." });
  });
  it('能检测到 POST /demo2, id 和 name 不存在', async () => {
    const data = await ctrl.postReq('/demo2');
    expect(data).toStrictEqual({ "code": 400001, "msg": "参数 \"id\" 不能为空. 参数 \"name\" 不能为空." });
  });
});
