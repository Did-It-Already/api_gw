import { generalRequest} from '../utilities';
import { checkAuth } from '../auth.utilities';

const tasks_url = `http://host.docker.internal:9000/task`;

const resolvers = {
	Query: {
		allTasks: async (_, {}, contextValue) =>
		{
			// console.log(contextValue, user_id)
			const check = await checkAuth(contextValue);
			return check instanceof Error ? check : generalRequest(`${tasks_url}s/${contextValue.user_id}`, 'GET')
		},
		taskById: async (_, { task_id }, contextValue) =>
			{
				const check = await checkAuth(contextValue);
				const result = await generalRequest(`${tasks_url}/${contextValue.user_id}/${task_id}`, 'GET')
				const newresult = Object.fromEntries([...Object.entries(result)].map(([k,v]) => [k.toLowerCase(),v]))
				// console.log(newresult)
				return check instanceof Error ? check : newresult
			},
	},
	Mutation: {
		createTask: async (_, { task }, contextValue) =>
			{
				const check = await checkAuth(contextValue);
				task.user_id = contextValue.user_id.toString();
				return check instanceof Error ? check : generalRequest(`${tasks_url}`, 'POST', task)
			},
		updateTask: async (_, {  task_id, task }, contextValue) =>
			{
				const check = await checkAuth(contextValue);
				return check instanceof Error ? check : generalRequest(`${tasks_url}/${contextValue.user_id}/${task_id}`, 'PUT', task)
				
			},
		updateTaskIsDone: async (_, {  task_id }, contextValue) =>
			{
				const check =  await checkAuth(contextValue);
				return check instanceof Error ? check : generalRequest(`${tasks_url}/${contextValue.user_id}/${task_id}`, 'PATCH')
			},
		deleteTask: async (_, {task_id }, contextValue) =>
			{
				const check = await checkAuth(contextValue);
				return check instanceof Error ? check : generalRequest(`${tasks_url}/${contextValue.user_id}/${task_id}`, 'DELETE')
			}
	}
};

export default resolvers;
