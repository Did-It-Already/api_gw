import { generalRequest, getRequest } from '../../utilities';

const tasks_url = `http://127.0.0.1:9000/task`;
import userResolvers from "./user.resolver"

const resolvers = {
	Query: {
		allTasks: (_) =>
			getRequest(tasks_url+'s', ''),
		taskById: async (_, { user_id, task_id }) =>
			{
				const user = await userResolvers.Query.userById(null, {user_id: user_id} );
				generalRequest(`${tasks_url}/${user.user_id}/${task_id}/`, 'GET')
			}
			,
	},
	Mutation: {
		createTask: async (_, { user_id, task }) =>
			{
				const user = await userResolvers.Query.userById(null, {user_id: user_id} );
				task.user_id = user.user_id
				generalRequest(`${tasks_url}/`, 'POST', task)
			},
		updateTask: async (_, { user_id , task_id, task }) =>
			{
				const user = await userResolvers.Query.userById(null, {user_id: user_id} );
				generalRequest(`${tasks_url}/${user.user_id}/${task_id}/`, 'PUT', task)
			},
		updateTaskIsDone: async (_, { user_id , task_id }) =>
			{
				const user = await userResolvers.Query.userById(null, {user_id: user_id} );
				generalRequest(`${tasks_url}/${user.user_id}/${task_id}/`, 'PATCH')
			},
		deleteTask: async (_, { user_id, task_id }) =>
			{
				const user = await userResolvers.Query.userById(null, {user_id: user_id} );
				generalRequest(`${tasks_url}/${user.user_id}/${task_id}/`, 'DELETE')
			}
	}
};

export default resolvers;
