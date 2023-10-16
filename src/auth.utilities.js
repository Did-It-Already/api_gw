import request from 'request-promise-native';

export async function getUserId(token) {
	if (!token) {
		throw new Error('No authorization token provided');
	}

	// const request = new Request('http://127.0.0.1:8000/api/auth/check', {
	// 	method: 'GET',
	// 	withCredentials: true,
	// 	credentials: 'include',
	// 	mode: 'cors',
	// 	headers:  {
	// 		Authorization: `Bearer ${token}`
	// 	}
	// });
	// call auth service to validate token
	// console.log(request);	

	
		// Usa 'fetch' aquí para realizar solicitudes HTTP.
		const parameters = {
			method: 'GET',
			withCredentials: true,
			credentials: 'include',
			mode: 'cors',
			headers:  {
				Authorization: `Bearer ${token}`
			},
			uri: encodeURI('http://host.docker.internal:8000/api/auth/check'),
			json: true
		};
		const response = await request(parameters);
	// 	const response = await fetch('http://host.docker.internal:8000/api/auth/check', {
	// 		method: 'GET',
	// 		withCredentials: true,
	// 		credentials: 'include',
	// 		mode: 'cors',
	// 		headers:  {
	// 			Authorization: `Bearer ${token}`
	// 		}
	// });
		if (!response.ok) {
			return  new Error('Invalid token');
		}
		//TODO: handle better errors (no id when deleting, show invalid token msg )
		const data = (await response.json()).data;
		const user= data.user;
		return {user_id: user.user_id, id: user.id};
	  }

export async function checkAuth(contextValue) {
	if ((typeof contextValue.user_id === "undefined") ) {
		return new Error('Not Authenticated');
	}
}