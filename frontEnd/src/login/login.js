import axios from "axios";


async function validaAPI (servidor, user, password) {
	try {
		const API_URL = process.env.VUE_APP_API_URL;

		const payload = {
			username: user,
			password: password,
		};

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const response = await axios.post(`${API_URL}/auth/login`, 
			payload, config);
		
		return {
			success: true,
			error: null,
			token: response.data.access_token,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default validaAPI;
