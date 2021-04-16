var data = require('../bd.json')
const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body');
const app = new Koa();

router.get('/proveedores', async (ctx, next) => {
    let pag = ctx.query.pag;
    let numreg = ctx.query.reg;
    console.log(data)
    if (typeof pag !== "undefined" && typeof numreg !== "undefined"){
        let temp = [...data];
        ctx.body = temp.splice((pag-1)*numreg, numreg);
    }else
        ctx.body = data;
    await next();
});

router.get('/proveedores/:id', async (ctx, next) => {
    let proveedor = data.filter(proveedor => (proveedor.id == ctx.params.id));

	if (proveedor.length>0) {
		ctx.body = proveedor[0];
	} else {
		ctx.response.status = 404;
		ctx.body = 'Proveedor no encontrado';
	}
	await next();
});

router.post('/proveedores', koaBody(), async (ctx, next) => {
    console.log(ctx.request.body)
	if (!ctx.request.body.nombre || 
        !ctx.request.body.razonsocial || !ctx.request.body.direccion){
		ctx.response.status = 400;
		ctx.body = 'Falta info';
	}else{
        // Buscamos si existe un proveedor con ese nombre 
        let proveedor = data.filter(proveedor => (proveedor.nombre == ctx.request.body.nombre));
        if (proveedor.length>0) { // Si existe un proveedor con el mismo nombre
            ctx.response.status = 409;
		    ctx.body = {code: 409};
        } else {
            data.push({
                id: data.length + 1,
                nombre: ctx.request.body.nombre,
                razonsocial: ctx.request.body.razonsocial,
                direccion: ctx.request.body.direccion,
            });
            var json = JSON.stringify(data);
            var fs = require('fs');
            fs.writeFile('bd.json', json, 'utf8', ()=>{console.log('Datos actualizados Ok')});
            ctx.response.status = 201;
            ctx.body = JSON.stringify({code:200});
        }
	}
	await next();
});

router.delete('/proveedores/:id', async (ctx, next) => {
    let proveedorIndex = data.findIndex(proveedor => (proveedor.id == ctx.params.id));
    if (proveedorIndex>=0){
        data.splice(proveedorIndex, 1);
        var json = JSON.stringify(data);
        var fs = require('fs');
        fs.writeFile('bd.json', json, 'utf8', ()=>{console.log('Datos actualizados Ok')});
        ctx.response.status = 200;
        ctx.body = 'Proveedor eliminado';
    }else{
        ctx.response.status = 404;
		ctx.body = 'Proveedor no encontrado';
    }

	await next();
});

app.use(router.routes()); 
module.exports = app;