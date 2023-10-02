import { generalRequest, getRequest } from '../../utilities';
import { isAuthorized, checkAuth } from '../../auth.utilities';

const tasks_url = `http://127.0.0.1:9000/task`;

const resolvers = {
	Query: {
		allTasks: async (_, { user_id }, contextValue) =>
		{
			// console.log(contextValue, user_id)
			const check = await checkAuth(contextValue, parseInt(user_id));
			return check instanceof Error ? check : generalRequest(`${tasks_url}s/${user_id}`, 'GET')
		},
		taskById: async (_, { user_id, task_id }, contextValue) =>
			{
				const check = await checkAuth(contextValue, parseInt(user_id));
				const result = await generalRequest(`${tasks_url}/${user_id}/${task_id}`, 'GET')
				const newresult = Object.fromEntries([...Object.entries(result)].map(([k,v]) => [k.toLowerCase(),v]))
				// console.log(newresult)
				return check instanceof Error ? check : newresult
			},
	},
	Mutation: {
		createTask: async (_, { user_id, task }, contextValue) =>
			{
				const check = checkAuth(contextValue, parseInt(user_id));
				task.user_id = user_id
				return check instanceof Error ? check : generalRequest(`${tasks_url}`, 'POST', task)
			},
		updateTask: async (_, { user_id , task_id, task }, contextValue) =>
			{
				const check = checkAuth(contextValue, parseInt(user_id));
				return check instanceof Error ? check : generalRequest(`${tasks_url}/${user_id}/${task_id}`, 'PUT', task)
				
			},
		updateTaskIsDone: async (_, { user_id , task_id }, contextValue) =>
			{
				const check = checkAuth(contextValue, parseInt(user_id));
				return check instanceof Error ? check : generalRequest(`${tasks_url}/${user_id}/${task_id}`, 'PATCH')
			},
		deleteTask: async (_, { user_id, task_id }, contextValue) =>
			{
				const check = checkAuth(contextValue, parseInt(user_id));
				return check instanceof Error ? check : generalRequest(`${tasks_url}/${user_id}/${task_id}`, 'DELETE')
			}
	}
};

export default resolvers;
