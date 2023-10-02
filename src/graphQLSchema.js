import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	userMutations,
	userQueries,
	userTypeDef
} from './swarch2023ii/typeDefs/user.typeDefs';

import {
	taskMutations,
	taskQueries,
	taskTypeDef
} from './swarch2023ii/typeDefs/tasks.typeDefs';

import {
	authMutations,
	authQueries,
	authTypeDef
} from './swarch2023ii/typeDefs/auth.typeDefs';

import userResolvers from './swarch2023ii/resolvers/user.resolver';
import tasksResolvers from './swarch2023ii/resolvers/tasks.resolver';
import authResolvers from './swarch2023ii/resolvers/auth.resolver';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		userTypeDef,
		taskTypeDef,
		authTypeDef

	],
	[
		userQueries,
		taskQueries,
		authQueries
	],
	[
		userMutations,
		taskMutations,
		authMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		userResolvers,
		tasksResolvers,
		authResolvers

	)
});

