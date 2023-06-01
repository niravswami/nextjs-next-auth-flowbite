import axios from "@/lib/axios";
import { getCookie } from "cookies-next";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import UserLayout from "@/components/layouts/UserLayout";

const secret = process.env.NEXTAUTH_SECRET;

export default function dashboard({ data }) {
	return (
		<UserLayout>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
			</div>
			<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div>
			<div className="grid grid-cols-2 gap-4 mb-4">
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
			</div>
			<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div>
			<div className="grid grid-cols-2 gap-4">
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
			</div>
		</UserLayout>
	);
}

// This gets called on every request
export async function getServerSideProps({ req, res }) {
	// const token = await getToken({ req, secret });
	const session = await getServerSession(req, res, authOptions);
	// console.log("JSON Web Token", token);
	// console.log("session", session);
	console.log(
		"req",
		// req,
		// "req.cookies",
		// req.cookies["next-auth.session-token"],
		"res",
		// res,
		// 'getCookie("authorization")',
		// getCookie("authorization")'
		// "token",
		// token,
		"sessionsession"
		// session
	);
	let response;
	// Fetch data from external API
	response = await axios({ req })
		.get("/dashboard")
		.then((resp) => {
			// console.log("resp", resp?.data)
			return resp?.data;
		})
		.catch((err) => {
			console.log("err catch", err?.response);
			if (response && err?.response?.status === 401) {
				return {
					redirect: {
						permanent: false,
						destination: "/auth/logout",
					},
					props: {},
				};
			}
		});
	console.log("response", response);
	const data = {
		dashboardData: {
			name: "Nirav",
		},
	};

	// Pass data to the page via props
	return { props: { data } };
}
