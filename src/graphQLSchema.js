import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	userMutations,
	userQueries,
	userTypeDef
} from './typeDefs/user.typeDefs';

import {
	taskMutations,
	taskQueries,
	taskTypeDef
} from './typeDefs/tasks.typeDefs';

import {
	authMutations,
	authQueries,
	authTypeDef
} from './typeDefs/auth.typeDefs';

import {
	habitTypeDef,
	habitMutations,
	habitQueries
} from './typeDefs/habits.typeDefs';

import userResolvers from './resolvers/user.resolver';
import tasksResolvers from './resolvers/tasks.resolver';
import authResolvers from './resolvers/auth.resolver';
import habitsResolvers from './resolvers/habits.resolver';

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

