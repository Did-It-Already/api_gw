export async function getUserId(token) {
	if (!token) {
		throw new Error('No authorization token provided');
	}

	const request = new Request('http://127.0.0.1:8000/api/auth/check', {
		method: 'GET',
		withCredentials: true,
		credentials: 'include',
		mode: 'cors',
		headers:  {
			Authorization: `Bearer ${token}`
		}
	});
	// call auth service to validate token
	console.log(request);	
	const response = await fetch('http://127.0.0.1:8000/api/auth/check', request);
	if (!response.ok) {
		return  new Error('Invalid token');
	}
	const data = (await response.json()).data;
	const user= data.user;
	return user.user_id;
}
export function isAuthorized(userId, req_user_id) {
	if (!userId ) {
		return false 
	}
	if (userId !== req_user_id) {
		return false
	}
	return true;
}

export async function checkAuth(contextValue, user_id) {
	if ((contextValue.user_id == undefined) ) {
		// return error
		return new Error('Not Authenticated');

	}
	if (!isAuthorized(contextValue.user_id, user_id)) {
		return new Error('Unauthorized');
	}
}