import Axios from "axios";
import { getCookie } from "cookies-next";

// const axios = Axios.create({
// 	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_V1,
// 	headers: {
// 		"X-Requested-With": "XMLHttpRequest",
// 		// Authorization: `Bearer ${getCookie("accessToken")}`,
// 		// "X-Access-Token-N": `getCookie("authorization")`,
// 	},
// 	withCredentials: true,
// });

// export default axios;

import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL_V1 || "http://localhost";

const ApiClient = ({ req = {}, session = null }) => {
	const defaultOptions = {
		baseURL,
	};

	const instance = Axios.create(defaultOptions);

	instance.interceptors.request.use(async (request) => {
		request.headers["X-Requested-With"] = `XMLHttpRequest`;
		if (!session) session = await getSession({ req });

		// console.log("sessionsessionsessionsessionsessionsession", session);
		if (session) {
			request.headers.Authorization = `Bearer ${session?.accessToken}`;
		}
		return request;
	});

	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			// console.log(`error`, "error");
			return Promise.reject(error);
		}
	);

	return instance;
};

const axios = ApiClient;

export default axios;
