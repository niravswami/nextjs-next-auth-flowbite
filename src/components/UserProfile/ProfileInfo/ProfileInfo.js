"use client";
import { SOMETHING_WENT_WRONG_TRY_AGAIN } from "@/helpers/errorMsg";
import { API_URL, FULL_URL } from "@/helpers/urls";
import { IS_VALID_FN } from "@/helpers/validations/validationsFn";
import axios from "@/lib/axios";
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ProfileInfo = () => {
	const router = useRouter();
	const { data: sessionData, update } = useSession();
	const [formValues, setFormValues] = useState({
		name: "",
		email: "",
	});

	const [errors, setErrors] = useState({
		name: "",
		email: "",
	});

	const [status, setStatus] = useState(null);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (sessionData?.user)
			setFormValues({
				name: sessionData?.user?.name,
				email: sessionData?.user?.email,
			});

		return () => {
			setFormValues({ name: "", email: "" });
			setErrors({ name: "", email: "" });
		};
	}, [sessionData]);

	const handleOnChange = async (e) => {
		let target = e.target;
		let value = target.value;

		let newErros = { ...errors, [target.name]: "" };

		if (value.trim() === "") {
			newErros[target.name] = `${target.name} field is required`;
		} else if (target.name === "email" && !IS_VALID_FN.email(value)) {
			newErros.email = "invalid email address";
		}

		setErrors(newErros);

		setFormValues((prev) => {
			return { ...prev, [target.name]: value };
		});
	};

	const hancleOnSaveBtnClick = async () => {
		setIsLoading(true);
		setStatus(null);

		let response = await axios({ session: sessionData })
			.patch(API_URL.UPDATE_USER_PROFILE, { ...formValues })
			.then((res) => res.data)
			.catch((err) => err.response);

		console.log("hancleOnSaveBtnClick response", response);
		if (response.success) {
			let oldEmail = sessionData?.user?.email;
			await update({
				...sessionData,
				user: {
					...sessionData.user,
					...response?.data?.user,
				},
			});

			if (oldEmail !== formValues?.email) {
				router.replace(FULL_URL.VERIFY_EMAIL);
			}
		} else {
			if (response?.status === 401) {
				router.replace(FULL_URL.SESSION_EXPIRE);
			} else {
				setStatus(response?.data?.msg || SOMETHING_WENT_WRONG_TRY_AGAIN);
			}
		}
		setIsLoading(false);
	};

	const isActionBtnDisabled =
		Object.keys(errors).filter((err) => errors[err] !== "").length > 0 ||
		Object.keys(formValues).filter((err) => formValues[err] === "").length > 0;

	return (
		<Card className="max-w-7xl">
			<div>
				<h5 className=" text-md   text-gray-900 md:text-xl dark:text-white">
					Profile Information
				</h5>
				<span className="text-sm font-light text-gray-500 dark:text-gray-400">
					Update your account&apos;s profile information and email address.
				</span>
			</div>
			{status && <Alert color={"failure"}>{status}</Alert>}
			<form className="flex max-w-md flex-col gap-4">
				<div>
					<div className="mb-2 block">
						<Label htmlFor="name" value="Name" />
					</div>
					<TextInput
						id="name"
						name="name"
						required
						shadow
						type="text"
						value={formValues?.name}
						onChange={handleOnChange}
						color={errors.name ? "failure" : "gray"}
						helperText={
							errors.name ? <React.Fragment>{errors.name}!</React.Fragment> : ""
						}
					/>
				</div>
				<div>
					<div className="mb-2 block">
						<Label htmlFor="email" value="Email" />
					</div>
					<TextInput
						id="email"
						name="email"
						placeholder="name@flowbite.com"
						required
						shadow
						type="email"
						value={formValues?.email}
						onChange={handleOnChange}
						color={errors.email ? "failure" : "gray"}
						helperText={
							errors.email ? (
								<React.Fragment>{errors.email}!</React.Fragment>
							) : (
								""
							)
						}
					/>
				</div>

				<Button
					disabled={isActionBtnDisabled || isLoading}
					type="submit"
					className="max-w-fit"
					onClick={hancleOnSaveBtnClick}
					isProcessing={isLoading}
				>
					Save
				</Button>
			</form>
		</Card>
	);
};

export default ProfileInfo;
