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
	//TODO: handle better errors (no id when deleting, show invalid token msg )
	const data = (await response.json()).data;
	const user= data.user;
	return user.user_id;
}

export async function checkAuth(contextValue) {
	if ((typeof contextValue.user_id === "undefined") ) {
		return new Error('Not Authenticated');
	}
}