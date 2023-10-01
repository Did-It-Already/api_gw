'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}
	console.log(url);

	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}/${path}`, parameters);
	console.log(queryUrl);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const userTypeDef = `
  scalar Upload
  type User {
    user_id: Int!
    name: String!
    last_name: String!
    email: String!
    image_url: String
    theme: String!
  }
  input UserInput {
    name: String!
    last_name: String!
    email: String!
    profile_picture: String
    theme: String!
  }`;

const userQueries = `
      allUsers: [User]!
      userById(user_id: Int!): User!
  `;

const userMutations = `
    createUser(user: UserInput!): User!
    updateUser(user_id: Int!, user: UserInput!): User!
    deleteUser(user_id: Int!): User
`;

async function getUserId(token) {
	if (!token) {
		throw new Error('No authorization token provided');
	}

	const request$$1 = new Request('http://127.0.0.1:8000/api/auth/check', {
		method: 'GET',
		withCredentials: true,
		credentials: 'include',
		mode: 'cors',
		headers:  {
			Authorization: `Bearer ${token}`
		}
	});
	// call auth service to validate token
	console.log(request$$1);	
	const response = await fetch('http://127.0.0.1:8000/api/auth/check', request$$1);
	if (!response.ok) {
		return  new Error('Invalid token');
	}
	const data = (await response.json()).data;
	const user= data.user;
	return user.user_id;
}
function isAuthorized(userId, req_user_id) {
	if (!userId ) {
		return false 
	}
	if (userId !== req_user_id) {
		return false
	}
	return true;
}

async function checkAuth(contextValue, user_id) {
	if ((contextValue.user_id == undefined) ) {
		// return error
		return new Error('Not Authenticated');

	}
	if (!isAuthorized(contextValue.user_id, user_id)) {
		return new Error('Unauthorized');
	}
}

const users_url = `http://127.0.0.1:8001/users`;

const resolvers = {
	Query: {
		allUsers: (_) =>
			getRequest(users_url, ''),
		userById: (_, { user_id },contextValue) =>{
			const check = checkAuth(contextValue, user_id);

			return check instanceof Error ? check : generalRequest(`${users_url}/${user_id}/`, 'GET')
		}
			
	},
	Mutation: {
		createUser: (_, { user }) =>
			generalRequest(`${users_url}/`, 'POST', user),
		updateUser: (_, { user_id, user }) =>
			generalRequest(`${users_url}/${user_id}/`, 'PUT', user),
		deleteUser: (_, { user_id }) =>
			generalRequest(`${users_url}/${user_id}/`, 'DELETE')
	}
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		userTypeDef
	],
	[
		userQueries
	],
	[
		userMutations
	]
);

// Generate the schema object from your types definition.
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;
require('dotenv').config({ path: './.env' });
app.use(koaLogger());

const koaOptions = {
	origin:true,
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
		ctx.state.user_id = await getUserId(ctx.header.authorization.slice(7));

	}
	await next();
});



// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { user_id: ctx.state.user_id },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
