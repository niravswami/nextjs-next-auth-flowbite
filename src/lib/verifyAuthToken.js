import { jwtVerify } from "jose";

const getJwtSecret = () => {
	const secret = process.env.NEXTAUTH_SECRET;

	if (!secret || secret.length === 0) {
		throw new Error("the environment variable NEXTAUTH_SECRET not set");
	}
	return secret;
};

export const verifyAuthToken = async (token) => {
	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(getJwtSecret())
		);
		return payload;
	} catch (error) {
		throw new Error("Token is invalid or expired");
	}
};
