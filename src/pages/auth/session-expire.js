import AuthLayout from "@/components/layouts/AuthLayout";
import { FULL_URL } from "@/helpers/urls";
import useAuth from "@/hooks/useAuth";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function SessionExpire() {
	const { data: sessionData } = useSession();
	const { logout } = useAuth();
	useEffect(() => {
		// let timer;
		// if (sessionData) {
		// 	timer = setTimeout(() => {
		// 		async () =>
		// 			await logout({
		// 				session: sessionData,
		// 				signOut: () => signOut({ callbackUrl: FULL_URL.LOGIN }),
		// 			})();
		// 	}, 2000);
		// }
		// return () => clearTimeout(timer);
		logout({
			session: sessionData,
		});
	}, [sessionData, logout]);
	return (
		<>
			<AuthLayout>
				<Head>
					<title>Session Expire</title>
				</Head>
				<span className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
					Session Expired
				</span>
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
						Your session has been expired, you are redirecting to login page
					</div>
				</div>
			</AuthLayout>
		</>
	);
}
