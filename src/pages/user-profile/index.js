"use client";
import ProfileInfo from "@/components/UserProfile/ProfileInfo/ProfileInfo";
import UpdatePasswordForm from "@/components/UserProfile/UpdatePasswordForm";
import UserLayout from "@/components/layouts/UserLayout";
// import { useSession } from "next-auth/react";

import React from "react";

const UserProfile = () => {
	return (
		<UserLayout>
			<div className="flex flex-col gap-6">
				<ProfileInfo />
				<UpdatePasswordForm />
			</div>
		</UserLayout>
	);
};

export default UserProfile;
