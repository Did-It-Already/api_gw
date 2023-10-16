import { generalRequest, getRequest } from '../utilities';
import { isAuthorized, checkAuth } from '../auth.utilities';

const habits_url = `http://host.docker.internal:3525`;

const resolvers = {
	Query: {
		habits: async (_) => generalRequest(`${habits_url}/habitos`, 'GET'), 
        userHabits: async (_, {  _id}, contextValue) => {

			const check = await checkAuth(contextValue);
			if (check instanceof Error) {
				return check
			}
			else {
				return _id === undefined ? generalRequest(`${habits_url}/habitos/${contextValue.user_id}`, 'GET') : generalRequest(`${habits_url}/habitos/${contextValue.user_id}/${_id}`, 'GET')
			}
        }
        ,
		
	},
    Mutation: {
		createHabit: async (_, {habit }, contextValue) =>
			{
				const check = await checkAuth(contextValue);
				habit.user_id = contextValue.user_id
				return check instanceof Error ? check : generalRequest(`${habits_url}/habitos`, 'POST', habit)
			},
		updateHabit: async (_, { _id, habit }, contextValue) =>
			{
				const check = await checkAuth(contextValue);
				return check instanceof Error ? check : generalRequest(`${habits_url}/habitos/${_id}`, 'PUT', habit)
			},
		deleteHabit: async (_, {_id},contextValue) => 
			{
				const check = await checkAuth(contextValue);
				return await generalRequest(`${habits_url}/habitos/${_id}`, 'DELETE')
			},
		updateHabitIsDone: async (_, {_id}) => 
			{
				return await generalRequest(`${habits_url}/hacer/${_id}`, 'PUT')
			},
		getStatistics: async (_, {habit_id, date, _id }, contextValue) =>
			{
				const check = await checkAuth(contextValue);
				if (check instanceof Error){
					return check
				}
				const queryParams = [];	
				queryParams.push(`user_id=${contextValue.user_id}`);
				if (habit_id) queryParams.push(`habit_id=${habit_id}`);
				if (date) queryParams.push(`date=${date}`);
				if (_id) queryParams.push(`_id=${_id}`);

				const query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
				const url = `${habits_url}/estadisticas${query}`;
				console.log(query)
				console.log(url)
				return await generalRequest(url, 'GET')
				

			},
		reviewHabits: async (_) => 
			{
				return await generalRequest(`${habits_url}/revisar`, 'PUT')
			}
		},
        
		
		
};


export default resolvers;
