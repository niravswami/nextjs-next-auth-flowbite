export const URI = {
	LOGIN: "auth/login",
	SIGNUP: "auth/signup",
	LOGOUT: "auth/logout",
	VERIFY_EMAIL: "verify-email",
	SESSION_EXPIRE: "auth/session-expire",
	DASHBOARD: "dashboard",
	SEND_EMAIL_VERIFICATION_LINK: "email/verification-notification",
	FORGOT_PASSWORD: "auth/forgot-password",
	UPDATE_USER_PROFILE: "profile",
	PASSWORD_UPDATE: "password-update",
};
export const FULL_URL = {
	LOGIN: `${process.env.NEXT_PUBLIC_BASE_URL}/${URI.LOGIN}`,
	SIGNUP: `${process.env.NEXT_PUBLIC_BASE_URL}/${URI.SIGNUP}`,
	VERIFY_EMAIL: `${process.env.NEXT_PUBLIC_BASE_URL}/${URI.VERIFY_EMAIL}`,
	DASHBOARD: `${process.env.NEXT_PUBLIC_BASE_URL}/${URI.DASHBOARD}`,
	SESSION_EXPIRE: `${process.env.NEXT_PUBLIC_BASE_URL}/${URI.SESSION_EXPIRE}`,
	FORGOT_PASSWORD: `${process.env.NEXT_PUBLIC_BASE_URL}/${URI.FORGOT_PASSWORD}`,
};

export const API_URL = {
	SEND_EMAIL_VERIFICATION_LINK: `${process.env.NEXT_PUBLIC_BACKEND_URL_V1}/${URI.SEND_EMAIL_VERIFICATION_LINK}`,
	LOGOUT: `${process.env.NEXT_PUBLIC_BACKEND_URL_V1}/${URI.LOGOUT}`,
	FORGOT_PASSWORD: `${process.env.NEXT_PUBLIC_BACKEND_URL_V1}/forgot-password`,
	UPDATE_USER_PROFILE: `${process.env.NEXT_PUBLIC_BACKEND_URL_V1}/${URI.UPDATE_USER_PROFILE}`,
	PASSWORD_UPDATE: `${process.env.NEXT_PUBLIC_BACKEND_URL_V1}/${URI.PASSWORD_UPDATE}`,
};
