import React from "react";
import UserNavbar from "../navbar/UserNavbar";

export default function UserLayout({ children }) {
	return (
		<>
			<div className="antialiased bg-gray-50 dark:bg-gray-900">
				<UserNavbar />
				<main className="p-4 w-full md:w-10/12 mx-auto h-auto pt-20">
					{children}
				</main>
			</div>
		</>
	);
}
