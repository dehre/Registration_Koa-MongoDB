const Koa = require('koa'),
      Router = require('koa-router'),
      bodyParser = require('koa-body'),
      render = require('koa-ejs'),
      path = require('path'),
      mongoose = require('mongoose')

const app = new Koa()


//error handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})


//MONGO DB
mongoose.connect('mongodb://localhost:27017/koa-auth', { useMongoClient: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

const User = require('./models/user')


//TEMPLATING ENGINE
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout/page',
  viewExt: 'ejs',
  cache: false,
  debug: false
})

//MIDDLEWARES
app.use(bodyParser())

//SERVE STATIC FILES
app.use(require('koa-static-server')({
  rootDir: 'static',
  rootPath: '/static'
}))

//ROUTER
const router = new Router()

router.get('/', async (ctx)=>{
  await ctx.render('home')
})

router.get('/register', async (ctx)=>{
  await ctx.render('register')
})

router.post('/register', async (ctx)=>{
  console.log(`Received POST '/register'. Body -->`)
  console.dir(ctx.request.body)
  ctx.redirect('/')
})

router.get('/login', async (ctx)=>{
  await ctx.render('login')
})

router.post('/login', async (ctx)=>{
  console.log(`Received POST '/login'. Body -->`)
  console.dir(ctx.request.body)
  ctx.redirect('/')
})

//apply router
app.use(router.routes())
   .use(router.allowedMethods())


app.listen(8080)
