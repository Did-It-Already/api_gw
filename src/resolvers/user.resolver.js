import { generalRequest, getRequest } from '../utilities';
import { isAuthorized, checkAuth } from '../auth.utilities';
const users_url = `http://127.0.0.1:8001/users`;

const resolvers = {
	Query: {
		allUsers: (_) =>
			getRequest(users_url, ''),
		userById: (_, { user_id }, contextValue) =>{
			const check = checkAuth(contextValue, user_id);
			return check instanceof Error ? check : generalRequest(`${users_url}/${user_id}/`, 'GET')
		}
			
	},
	Mutation: {
		createUser: (_, { user }) =>
		{
			console.log("IN CREATE USER")
			console.log(user)
			return generalRequest(`${users_url}/`, 'POST', user)
		},
		updateUser: (_, { user_id, user }, contextValue) =>
		{
			const check = checkAuth(contextValue, user_id);
			return check instanceof Error ? check : generalRequest(`${users_url}/${user_id}/`, 'PUT', user)
		},
		deleteUser: (_, { user_id }, contextValue) =>
		{
			const check = checkAuth(contextValue, user_id);
			return check instanceof Error ? check : generalRequest(`${users_url}/${user_id}/`, 'DELETE')
		}
			
	}
};

export default resolvers;
