import { generalRequest, getRequest } from '../../utilities';

const auth_url = `http://127.0.0.1:8000/api`;

const resolvers = {
	Query: {
		check: (_, { bearer_token }) =>
			generalRequest(`${auth_url}/auth/${user_id}/`, 'GET'),
	},
	Mutation: {
		login: (_, { user }) =>
			generalRequest(`${auth_url}/`, 'POST', user),
		register: (_, { auth_url, user }) =>
			generalRequest(`${auth_url}/${user_id}/`, 'PUT', user),
		deleteUser: (_, { auth_url }) =>
			generalRequest(`${users_url}/${user_id}/`, 'DELETE')
	}
};

export default resolvers;
