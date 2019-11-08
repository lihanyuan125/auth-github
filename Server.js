const koa = require("koa");
const router = require("koa-router")();
const static = require("koa-static");
const querystring = require("querystring");
const axios = require("axios");
const app = new koa();

app.use(static(__dirname + "/"));

const config = {
  client_id: "6a280f435497afa0e92d",
  client_secret: "fed9cf5d76d0a4cf568ab2e3ae57f8c911391bfc"
};

router.get("/github/login", ctx => {
  // ctx.body = "hello"
  let path =
    "https://github.com/login/oauth/authorize?client_id=" + config.client_id;
  //   console.log(path);  // https://github.com/login/oauth/authorize?client_id=6a280f435497afa0e92d
  ctx.redirect(path);
});

router.get("/github/callback", async ctx => {
  // console.log("...")
  const requestToken = ctx.request.query.code;
  // console.log(requestToken)   // 47f0427aac406d19383b
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: requestToken
  };
  let res = await axios.post(
    "https://github.com/login/oauth/access_token", params );
//   console.log(res.data);  //access_token=1f309b5b687349b1e9fb1f685da8fc4ec4696b28&scope=&token_type=bearer
//   console.log(typeof(res.data))   //string
  const access_token = querystring.parse(res.data).access_token
//   console.log(access_token)       //08eef81276c3b75084f8bc71105d163e8d7fe3f2
    let userInfo = await axios.get("https://api.github.com/user?access_token="+access_token)
    console.log(userInfo.data)
    ctx.body =`
    <h1>${userInfo.data.login}</h1>
    <img src = ${userInfo.data.avatar_url}/>
    `
});

app.use(router.routes()); // 启动路由
app.use(router.allowedMethods());

let port = 3000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
