import { generalRequest, getRequest } from '../../utilities';
import { isAuthorized, checkAuth } from '../../auth.utilities';

const habits_url = `http://127.0.0.1:3525`;

const resolvers = {
	Query: {
		habits: async (_) => generalRequest(`${habits_url}/habitos`, 'GET'), 
        userHabits: async (_, { user_id, _id}) => {
            console.log(_id === undefined)
            return _id === undefined ? generalRequest(`${habits_url}/habitos/${user_id}`, 'GET') : generalRequest(`${habits_url}/habitos/${user_id}/${_id}`, 'GET')
        }
        ,
		
	},
    Mutation: {
		createHabit: async (_, { user_id, habit }, contextValue) =>
			{
				const check = await checkAuth(contextValue, parseInt(user_id));
				habit.user_id = user_id
				return check instanceof Error ? check : generalRequest(`${habits_url}/habitos`, 'POST', habit)
			},
		updateHabit: async (_, { user_id , _id, habit }, contextValue) =>
			{
				const check = await checkAuth(contextValue, parseInt(user_id));
				return check instanceof Error ? check : generalRequest(`${habits_url}/habitos/${_id}`, 'PUT', habit)
			}
		},
        
		
		
};


export default resolvers;
