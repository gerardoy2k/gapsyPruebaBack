const Koa = require('koa');
const router = require('koa-router')();
const mount = require('koa-mount');
const cors = require('@koa/cors');

const app = new Koa();

app.use(cors());

app.use(mount(require('./router/proveedores.js')));
app.use(router.routes()); 
if(require.main === module) {
     app.listen(3001); 
}