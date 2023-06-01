import React from "react";
import AuthNavbar from "../navbar/AuthNavbar";
import { Button, Modal, Toast } from "flowbite-react";

import { useSelector, useDispatch } from "react-redux";
import { errorWhileAuthMutate } from "@/redux/slices/authSlice";

export const DEFAULT_AUTHLAYOUT_MODAL_PROPRS = {
	isOpen: false,
	msg: "",
};

export default function AuthLayout({ children }) {
	const dispatch = useDispatch();
	const errorWhileAuth = useSelector((state) => state.authData.errorWhileAuth);
	return (
		<>
			<section className="bg-gray-50 dark:bg-gray-900">
				<AuthNavbar />
				<div className="flex flex-col items-center justify-center px-2 md:px-6 py-8 mx-auto lg:py-0 h-screen">
					{children}
					<Modal
						show={errorWhileAuth?.errorMsg}
						size="md"
						popup={true}
						onClose={() => {
							dispatch(
								errorWhileAuthMutate({
									status: null,
									errorMsg: "",
								})
							);
						}}
					>
						<Modal.Header />
						<Modal.Body>
							<div className="text-center">
								<svg
									aria-hidden="true"
									className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
								<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
									{errorWhileAuth?.errorMsg}
								</h3>
							</div>
						</Modal.Body>
					</Modal>
				</div>
			</section>
		</>
	);
}
