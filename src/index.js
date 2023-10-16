import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaLogger from 'koa-logger';
import koaBody from 'koa-bodyparser';
import koaCors from '@koa/cors';

import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa';
import graphQLSchema from './graphQLSchema';

import { formatErr } from './utilities';
import {  getUserId } from './auth.utilities';

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;
require('dotenv').config({ path: './.env' });
app.use(koaLogger());

const koaOptions = {
	origin:'*',
	credentials:true,
	headers: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(koaCors(koaOptions));

// read token from header
app.use(async (ctx, next) => {
	
	if (ctx.request.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token == null || token == undefined ) {
			throw new Error('Invalid token');
		}

		//ctx.state.token = token[1];
		const ids =  await getUserId(ctx.header.authorization.slice(7));
		ctx.state.user_id = ids.user_id;
		ctx.state.id = ids.id;
		

	}
	await next();
});



// GraphQL
const graphql = graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { user_id: ctx.state.user_id, id: ctx.state.id },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql);
router.get('/graphql', graphql);

// test route
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
