import { SOMETHING_WENT_WRONG_TRY_AGAIN } from "@/helpers/errorMsg";
import axios from "@/lib/axios";
import { errorWhileAuthMutate } from "@/redux/slices/authSlice";
import { getCsrfToken, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";

export default function useAuth({ middleware, redirectIfAuthenticated } = {}) {
	const router = useRouter();
	const dispatch = useDispatch();
	// session.update({
	//   name: "Nirav Swami",
	//   email: "user1@aa.aa",
	//   sub: "1",
	//   iat: 1684732661,
	//   exp: 1687324661,
	//   jti: "372d736e-359a-4302-98d4-51cf66a28559",
	// });

	// const {
	//   data: user,
	//   error,
	//   mutate,
	// } = useSWR("/user", () =>
	//   axios
	//     .get("/user/profile", { credentials: "include" })
	//     .then((res) => res.data)
	//     .catch((error) => {
	//       if (error.response.status !== 409) throw error;

	//       router.push("/verify-email");
	//     })
	// );

	// const csrf = () =>
	// 	axios({
	// 		url: "http://127.0.0.1:8000/sanctum/csrf-cookie",
	// 		method: "GET",
	// 		credentials: true,
	// 	});

	const { data: user, error, mutate } = useSWR("/user", (abc) => abc);
	const login = async ({ setErrors, setStatus, ...props }) => {
		// await csrf();

		setErrors([]);
		setStatus(null);
		axios
			.post("/user/login", props)
			.then((res) => {
				mutate({ ...res?.data?.user });
				// mutate();
			})
			.catch((error) => {
				if (error.response.status === 422) {
					setErrors(error.response.data.errors);
				} else {
					dispatch(
						errorWhileAuthMutate({
							status: error?.response?.status,
							errorMsg:
								error?.response?.data?.message ||
								"something went worng! please try again after ",
						})
					);
				}
				// setStatus(error.response.status);
			});
	};

	const register = async ({ setErrors, ...props }) => {
		// const csrfToken = await csrf().then((res) => console.log("ress", res));
		// const csrfToken = await getCsrfToken();
		// console.log("csrfToken", csrfToken);

		setErrors([]);

		await axios
			.post("/user/register", props)
			.then((res) => {
				console.log("res", res);
				mutate();
			})
			.catch((error) => {
				// if (error.response.status !== 422) throw error
				console.log("error", error);
				// setErrors(error.response.data.errors)
				if ([422].includes(error.response.status)) {
					setErrors(error.response.data.errors);
				} else if ([400].includes(error.response.status)) {
					setErrors(error.response.data);
				} else {
					dispatch(
						errorWhileAuthMutate({
							status: error?.response?.status,
							errorMsg:
								error?.response?.data?.message ||
								"something went worng! please try again after ",
						})
					);
				}
			});
	};

	const resendEmailVerification = ({ setStatus }) => {
		axios
			.post("/email/verification-notification")
			.then((response) => setStatus(response.data.status));

		// axios({
		//   url: "http://127.0.0.1:8000/email/verification-notification",
		//   method: "POST",
		//   headers: {
		//     "X-Requested-With": "XMLHttpRequest",
		//   },
		//   withCredentials: true,
		// }).then((response) => setStatus(response.data.status));
	};

	const logout = async ({ session = {} }) => {
		// if (!error) {
		let response = await axios({ session })
			.post("/user/logout")
			.then((res) => res)
			.catch((err) => err.response);

		console.log("logout response ", response);

		if ([200, 401].includes(response?.status)) {
			await signOut();
			window.location.pathname = "/auth/login";
		} else {
			toast.error(SOMETHING_WENT_WRONG_TRY_AGAIN);
		}
		// }
	};

	const forgotPassword = async ({
		setErrors,
		setStatus,
		email,
		setisLoading,
	}) => {
		setErrors([]);
		setStatus(null);
		setisLoading(true);

		let response = await axios({})
			.post("/forgot-password", { email })
			.then((response) => response.data)
			.catch((error) => error.response);

		setisLoading(false);

		console.log("forgotPassword response", response);

		if (response?.success) {
			setStatus(response?.data?.status);
		} else {
			if (response?.status !== 422) throw error;
			setErrors(response.data.errors);
		}
	};

	const resetPassword = async ({
		setErrors,
		setStatus,
		setIsLoading,
		...props
	}) => {
		setErrors([]);
		setStatus(null);
		setIsLoading(true);

		console.log("router.query", router.query, "props", props, {
			token: router.query.token,
			...props,
			email: router.query.email,
		});

		// return;
		await axios({})
			.post("/reset-password", {
				token: router.query.token,
				...props,
				email: router.query.email,
			})
			.then((res) =>
				router.replace("/auth/login?reset=" + btoa(res.data.status))
			)
			.catch((error) => {
				setIsLoading(false);
				if (error.response.status !== 422) throw error;

				setErrors(error.response.data.msg);
			});
		// console.log("reset password response", response);
	};

	// useEffect(() => {
	// 	if (middleware === "guest" && redirectIfAuthenticated && user)
	// 		router.push(redirectIfAuthenticated);
	// 	if (window.location.pathname === "/verify-email" && user?.email_verified_at)
	// 		router.push(redirectIfAuthenticated);
	// 	if (middleware === "auth" && error) logout();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [user, error]);

	return {
		// user,
		register,
		login,
		forgotPassword,
		resetPassword,
		resendEmailVerification,
		logout,
	};
}
