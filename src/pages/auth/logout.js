import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Logout() {
	const router = useRouter();
	useEffect(() => {
		signOut({ callbackUrl: "http://localhost:3000/auth/login" });
	}, []);

	return <div>logout</div>;
}
