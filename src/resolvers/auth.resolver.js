import { generalRequest, getRequest } from '../utilities';

const auth_url = `http://127.0.0.1:8000/api`;
import userResolver from "./user.resolver"

const resolvers = {
	Query: {
		check: (_, { bearer_token }) =>
			generalRequest(`${auth_url}/auth/${user_id}/`, 'GET'),
	},
	Mutation: {
		login: (_, { user }) =>
			generalRequest(`${auth_url}/auth/login`, 'POST', user),
		register: async (_, { user }) =>
			{
				console.log(user)
				const userMutation = await userResolver.Mutation.createUser(null, {user:user})
				console.log(userMutation)
				user.user_id = userMutation.user_id
				console.log(user)
				return generalRequest(`${auth_url}/user/`, 'POST', user)
			},

		deleteUser: async (_, { }, contextValue) =>
			{
				const userMutation = await userResolver.Mutation.delete(null, {}, contextValue)
				if (userMutation instanceof Error) return userMutation
				return generalRequest(`${auth_url}/user/${contextValue.id}`,'DELETE', )
			},
		refresh: (_, {refresh}) => 
			generalRequest(`${auth_url}/auth/refresh`, 'POST', {refresh}),
	}
};

export default resolvers;
