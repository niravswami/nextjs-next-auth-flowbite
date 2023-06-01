import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FULL_URL } from "@/helpers/urls";

export default function AuthButtons() {
	const authBtns = [
		{
			text: "Google",
			img: (
				<svg viewBox="0 0 48 48" className=" w-5 mr-2">
					<title>Google Logo</title>
					<clipPath id="g">
						<path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
					</clipPath>
					<g className="colors" clipPath="url(#g)">
						<path fill="#FBBC05" d="M0 37V11l17 13z" />
						<path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
						<path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
						<path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
					</g>
				</svg>
			),
			className: "",
			signInOptions: {
				provider: "google",
				options: { callbackUrl: FULL_URL.DASHBOARD },
			},
		},
		{
			text: "Github",
			img: (
				<svg className=" w-5 mr-2" viewBox="0 0 24 24">
					<title>Github Logo</title>
					<path
						fill="currentColor"
						d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
					/>
				</svg>
			),
			className: "",
			signInOptions: {
				provider: "github",
				options: { callbackUrl: FULL_URL.DASHBOARD },
			},
		},
	];
	return (
		<div className="grid grid-cols-2 gap-4">
			{authBtns.map((btn) => (
				<button
					key={btn.text}
					onClick={async () => {
						await signIn(
							btn.signInOptions?.provider,
							btn.signInOptions?.options
						);
					}}
					type="button"
					className={`text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 ${btn.className}`}
				>
					<span className="flex items-center justify-center">
						{btn.img}
						<span>{btn.text}</span>
					</span>
				</button>
			))}
		</div>
	);
}
