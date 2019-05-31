const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-body');
const app = new Koa();
const { Pool } = require('pg');
const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'KoaDB',
  password: '',
  port: 5432,
});

const sessions = [];

app.use(bodyParser({
  multipart: true,
  urlencode: true
}));

router
  .post('/api/register', register)
  .post('/api/login', login)
  .get('/api/users', users);

async function register(ctx) {
  console.log(ctx.request.body);
  const res = await pool.query(
    'insert into users values ($1, $2, $3)',
    [ctx.request.body.eMail, ctx.request.body.keyWord, ctx.request.body]);
  ctx.body = '{}';
}

async function login(ctx) {
  console.log(ctx.request.body);
  const res = await pool.query(
    'select * from users where email = $1 and pass = $2', 
    [ctx.request.body.eMail, ctx.request.body.keyWord]);
  if (res.rows.length) {
    const cookieValue = "a" + Math.random();
    sessions.push(cookieValue);
    ctx.cookies.set("auth", cookieValue);
    ctx.body = '{}';
  } else {
    ctx.throw(403);
  }
}

async function users(ctx) {
  if (sessions.filter(s => ctx.request.header.cookie.replace('auth=', '') === s)[0]) {
    const res = await pool.query('select profile from users');
    ctx.body = { usersTable: res.rows.map(r => r.profile) };
  } else {
    ctx.throw(403);
  }
}

app.use(router.routes());
app.listen(3030);