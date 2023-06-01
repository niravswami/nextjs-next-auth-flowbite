import { CustomTextInput } from "@/components/CustomTextInput";
import AuthLayout from "@/components/layouts/AuthLayout";
import { FULL_URL } from "@/helpers/urls";
import useAuth from "@/hooks/useAuth";
import { Button, Label } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPassword() {
	const { forgotPassword } = useAuth({
		middleware: "guest",
		redirectIfAuthenticated: "/dashboard",
	});

	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState([]);
	const [status, setStatus] = useState(null);
	const [isLoading, setisLoading] = useState(false);

	const submitForm = (event) => {
		event.preventDefault();

		forgotPassword({ email, setErrors, setStatus, setisLoading });
	};

	return (
		<AuthLayout>
			<Head>
				<title>Forgot Password</title>
			</Head>
			<span className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
				Forgot Password
			</span>
			<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
					<div className="mb-4 text-sm text-gray-600">
						Forgot your password? No problem. Just let us know your email
						address and we will email you a password reset link that will allow
						you to choose a new one.
					</div>
					<div className="mb-4 font-medium text-sm text-green-600">
						{status}
					</div>

					<form className="space-y-4" action="#">
						<div>
							<CustomTextInput
								id="email"
								type={"email"}
								placeholder={"name@example.com"}
								required
								name={"email"}
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								color={errors?.email ? "failure" : "gray"}
								helperText={
									errors?.email ? (
										<React.Fragment>{errors?.email}!</React.Fragment>
									) : (
										""
									)
								}
							/>
						</div>

						<Button
							isProcessing={isLoading}
							type="submit"
							className="w-full"
							onClick={submitForm}
							disabled={email.trim() === "" || isLoading}
						>
							Email Password Reset Link
						</Button>
						<p className="flex justify-end text-sm font-light text-gray-500 dark:text-gray-400">
							<span className="font-medium text-primary-600 hover:underline dark:text-primary-500">
								<Link href={FULL_URL.LOGIN}>Login to your account</Link>
							</span>
						</p>
					</form>
				</div>
			</div>
		</AuthLayout>
	);
}
