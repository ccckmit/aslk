var Koa = require('koa')
var Router = require('koa-router')
// var serve = require('koa-static')
var send = require('koa-send')
var bodyParser = require('koa-bodyparser')
var path = require('path')
var aslk = require('../kernel/aslk')
var app = new Koa()
var router = new Router()

app.use(bodyParser())

function asl (text, s2t) {
  var p = aslk.analyze(text, s2t)
//  p.tree = aslk.formatParse(p)
  return p
}

app.use(async function (ctx, next) {
  var method = ctx.request.method
  var body
  if (method === 'GET') {
    if (ctx.path === '/') {
      ctx.redirect('/index.html')
    } else {
      await send(ctx, ctx.path, { root: path.join(__dirname, '../web') })
    }
  } else if (method === 'POST') {
    body = ctx.request.body
    if (ctx.path.startsWith('/asl/e2c')) {
      ctx.body = JSON.stringify(asl(body.source, 'e2c'), null, 2)
    } else {
      ctx.body = JSON.stringify(asl(body.source, 'c2e'), null, 2)
    }
  }
})

app.use(router.routes()).listen(8081)
