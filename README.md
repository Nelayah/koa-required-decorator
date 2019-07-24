# koa-required-decorator

一个校验 koa context 特定参数是否存在类方法装饰器 - Check Koa Context parameters exist or not.

## 安装

```bash
npm i koa-required-decorator --save
```

## 使用

跟 `koa-router` 使用的示例，

```javascript
import Required from "koa-required-decorator";

class Controller {
  @Required({
    query: ["id", "name"]
  })
  async getMethod(ctx, _) {
    ctx.body = "GET success";
  }

  @Required({
    "request.fields": ["id", "name"]
  })
  async postMethod(ctx, _) {
    ctx.body = "POST success";
  }
}

const transfer = async (ctx, next) => {
  ctx.request.fields = ctx.query;
  await next();
};

router.get("/demo1", ctrl.getMethod);
router.post("/demo2", transfer, ctrl.postMethod);
```

GET /demo1?id=1

输出结果：

```javascript
{ "errCode": 400000, "errMsg": "parameter \"name\" should not be null." }
```

POST /demo2?name=1

输出结果：

```javascript
{ "errCode": 400000, "errMsg": "parameter \"id\" should not be null." }
```

## API

### @Required(params: IParams)

```
interface IParams {
  [key: string]: string[]
}
```

根据传入的 KEY，查询 `Koa.context` 的特定字段是否含有 VALUE 里列举的属性。<br />
校验对象路径过深，需 `.` 隔开, 如校验 `ctx.request.fields.app.apple`，可以这么配置，

```javascript
@Required({
    'request.fields.app': ['apple']
})
```

### setKoaRequiredOptions(params: IOptions)

```
interface IOptions {
  errMsgFunc?: (errors: string[]) => string;
  responseFunc?: (params: string) => any;
}
```

可以自定义报错文案和返回的数据格式

| 参数         | 说明                 | 类型                                                                                                  | 默认                                                                         |
| ------------ | -------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| errMsgFunc   | 定义报错文案         | function(errors: string[]): string<br /> 传参 errors 为被校验为空的字段名集合，出参为定义的文案字符串 | errors => errors.map(k => 'parameter "\${k}" should not be null.').join(' ') |
| responseFunc | 定义报错返回数据格式 | function(params: string): any<br /> 其中 params 为 errMsgFunc 返回的字符串，出参为定义的数据格式      | errMsg => ({errCode: 400000, errMsg: params})                                |

```javascript
import { setKoaRequiredOptions } from "koa-required-decorator";

setKoaRequiredOptions({
  errMsgFunc: arr => arr.map(k => `参数 "${k}" 不能为空.`).join(" "),
  responseFunc: errMsg => {
    return {
      code: 400001,
      msg: errMsg
    };
  }
});
```

GET /demo1

输出结果：

```javascript
{ "code": 400001, "msg": "参数 \"id\" 不能为空. 参数 \"name\" 不能为空." }
```
