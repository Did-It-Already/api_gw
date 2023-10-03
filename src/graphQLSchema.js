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

import {
	habitTypeDef,
	habitMutations,
	habitQueries
} from './swarch2023ii/typeDefs/habits.typeDefs';

import userResolvers from './swarch2023ii/resolvers/user.resolver';
import tasksResolvers from './swarch2023ii/resolvers/tasks.resolver';
import authResolvers from './swarch2023ii/resolvers/auth.resolver';
import habitsResolvers from './swarch2023ii/resolvers/habits.resolver';
// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		userTypeDef,
		taskTypeDef,
		authTypeDef,
		habitTypeDef

	],
	[
		userQueries,
		taskQueries,
		authQueries,
		habitQueries
	],
	[
		userMutations,
		taskMutations,
		authMutations,
		habitMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		userResolvers,
		tasksResolvers,
		authResolvers,
		habitsResolvers

	)
});

