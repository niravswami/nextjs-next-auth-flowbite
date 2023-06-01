"use client";
import React, { useEffect, useState } from "react";
import { SOMETHING_WENT_WRONG_TRY_AGAIN } from "@/helpers/errorMsg";
import { API_URL, FULL_URL } from "@/helpers/urls";
import { IS_VALID_FN } from "@/helpers/validations/validationsFn";
import axios from "@/lib/axios";
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CLOSE_EYE_SVG, OPEN_EYE_SVG } from "@/helpers/svgPath";
import { CustomTextInput } from "../CustomTextInput";

const UpdatePasswordForm = () => {
	const DEFAULT_FORM_FIELDS = {
		current_password: "",
		password: "",
		password_confirmation: "",
	};

	const DEFAULT_STATUS = {
		isShow: false,
		success: "",
		msg: "",
	};
	const router = useRouter();
	const { data: sessionData } = useSession();
	const [formValues, setFormValues] = useState(
		structuredClone(DEFAULT_FORM_FIELDS)
	);

	const [errors, setErrors] = useState(structuredClone(DEFAULT_FORM_FIELDS));

	const [isLoading, setIsLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [status, setStatus] = useState(structuredClone(DEFAULT_STATUS));

	const resetValues = () => {
		setFormValues(structuredClone(DEFAULT_FORM_FIELDS));
		setErrors(structuredClone(DEFAULT_FORM_FIELDS));
	};

	useEffect(() => {
		return () => {
			resetValues();
		};
	}, []);

	const handleOnChange = async (e) => {
		let target = e.target;
		let value = target.value;

		let newErros = { ...errors, [target.name]: "" };

		if (value === "") {
			newErros[target.name] = `this field is required`;
		} else if (target.name !== "current_password") {
			newErros[target.name] = IS_VALID_FN.password(value);
		}

		setErrors(newErros);

		setFormValues((prev) => {
			return { ...prev, [target.name]: value };
		});
	};

	const hancleOnSaveBtnClick = async () => {
		setIsLoading(true);

		let response = await axios({ session: sessionData })
			.put(API_URL.PASSWORD_UPDATE, { ...formValues })
			.then((res) => res.data)
			.catch((err) => err.response);

		if (!response?.success) {
			if (response?.status === 401) {
				router.replace(FULL_URL.SESSION_EXPIRE);
			} else {
				setErrors(response?.data.errors);
			}
		} else {
			setStatus({ isShow: true, success: true, msg: response?.data?.msg });
			resetValues();
		}
		setIsLoading(false);
	};

	const onStatusDismiss = () => setStatus(structuredClone(DEFAULT_STATUS));

	const inputFields = [
		{
			id: "current_password",
			name: "current_password",
			type: show ? "text" : "password",
			label: "Current Password",
			placeholder: "••••••••",
			isRequired: true,
			value: formValues.current_password,
			addonEnd: (
				<span onClick={() => setShow(!show)}>
					{show ? OPEN_EYE_SVG : CLOSE_EYE_SVG}
				</span>
			),
		},
		{
			id: "password",
			name: "password",
			type: show ? "text" : "password",
			label: "New Password",
			placeholder: "••••••••",
			isRequired: true,
			value: formValues.password,
			addonEnd: (
				<span onClick={() => setShow(!show)}>
					{show ? OPEN_EYE_SVG : CLOSE_EYE_SVG}
				</span>
			),
		},
		{
			id: "password_confirmation",
			name: "password_confirmation",
			type: show ? "text" : "password",
			label: "Confirm Password",
			placeholder: "••••••••",
			isRequired: true,
			value: formValues.password_confirmation,
			addonEnd: (
				<span onClick={() => setShow(!show)}>
					{show ? OPEN_EYE_SVG : CLOSE_EYE_SVG}
				</span>
			),
		},
	];

	const isActionBtnDisabled =
		Object.keys(errors).filter((err) => errors[err] !== "").length > 0 ||
		Object.keys(formValues).filter((err) => formValues[err] === "").length > 0;

	return (
		<Card className="max-w-7xl">
			<div>
				<h5 className=" text-md   text-gray-900 md:text-xl dark:text-white">
					Update Password
				</h5>
				<span className="text-sm font-light text-gray-500 dark:text-gray-400">
					Ensure your account is using a long, random password to stay secure.
				</span>
			</div>
			{status?.isShow && (
				<Alert
					color={status?.success ? "success" : "failure"}
					onDismiss={onStatusDismiss}
				>
					{status?.msg}
				</Alert>
			)}
			<form className="flex max-w-md flex-col gap-4">
				{inputFields.map((field) => {
					return (
						<div key={field.id}>
							<div className="mb-2 block">
								<Label htmlFor={field.id} value={field.label} />
							</div>
							<CustomTextInput
								id={field.id}
								type={field.type}
								placeholder={field.placeholder}
								required={field.isRequired}
								addonEnd={field.addonEnd}
								name={field.name}
								value={field.value}
								onChange={handleOnChange}
								onBlur={field.onBlur}
								color={errors[field.id] ? "failure" : "gray"}
								helperText={
									errors[field.id] ? (
										<React.Fragment>{errors[field.id]}!</React.Fragment>
									) : (
										""
									)
								}
							/>
						</div>
					);
				})}

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

export default UpdatePasswordForm;
