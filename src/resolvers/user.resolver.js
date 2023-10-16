import { generalRequest, getRequest } from '../utilities';
import { isAuthorized, checkAuth } from '../auth.utilities';
const users_url = `http://host.docker.internal:8001/users`;

const resolvers = {
	Query: {
		allUsers: (_) =>
			getRequest(users_url, ''),
		userById: async (_, {}, contextValue) =>{
			const check = await checkAuth(contextValue);
			return check instanceof Error ? check : generalRequest(`${users_url}/${contextValue.user_id}/`, 'GET')
		}
			
	},
	Mutation: {
		createUser: (_, { user }) =>
		{
			console.log("IN CREATE USER")
			console.log(user)
			return generalRequest(`${users_url}/`, 'POST', user)
		},
		updateUser:async (_, { user }, contextValue) =>
		{
			const check = await checkAuth(contextValue);
			return check instanceof Error ? check : generalRequest(`${users_url}/${contextValue.user_id}/`, 'PUT', user)
		},
		delete:async  (_, { }, contextValue) =>
		{
			const check = await checkAuth(contextValue);
			return check instanceof Error ? check : generalRequest(`${users_url}/${contextValue.user_id}/`, 'DELETE')
		}
			
	}
};

export default resolvers;
