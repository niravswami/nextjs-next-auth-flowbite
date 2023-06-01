import { FULL_URL, URI } from "@/helpers/urls";
import useAuth from "@/hooks/useAuth";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function UserNavbar() {
	const { data: sessionData } = useSession();
	const router = useRouter();
	const { logout } = useAuth();

	const linkItems = [
		{
			link: `/${URI.DASHBOARD}`,
			text: "Dashboard",
		},
		{
			link: `/blog`,
			text: "Blog",
		},
	];

	const handleDropdownItemClick = (link) => {
		router.push(link);
	};
	return (
		<div className="fixed left-0 right-0 top-0 z-50">
			<Navbar>
				<Navbar.Brand href="https://flowbite.com/">
					<img
						alt="Flowbite Logo"
						className="mr-3 h-6 sm:h-9"
						src="https://flowbite.com/docs/images/logo.svg"
					/>
					<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
						Flowbite
					</span>
				</Navbar.Brand>
				{sessionData?.user && (
					<div className="flex md:order-2 ">
						<Dropdown
							inline
							label={
								<Avatar
									alt="User settings"
									img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
									rounded
								/>
							}
						>
							<Dropdown.Header>
								<span className="block text-sm">{sessionData?.user?.name}</span>
								<span className="block truncate text-sm font-medium">
									{sessionData?.user?.email}
								</span>
							</Dropdown.Header>
							{/* <Dropdown.Item
								onClick={() => handleDropdownItemClick(`/${URI.DASHBOARD}`)}
							>
								Dashboard
							</Dropdown.Item> */}
							<Dropdown.Item
								onClick={() => handleDropdownItemClick(`/user-profile`)}
							>
								Profile
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item
								onClick={async () =>
									await logout({
										session: sessionData,
									})
								}
							>
								Sign out
							</Dropdown.Item>
						</Dropdown>
						<Navbar.Toggle />
					</div>
				)}
				<Navbar.Collapse>
					{linkItems.map(({ link, text }) => (
						<Link key={link} href={link} legacyBehavior>
							<Navbar.Link
								active={router?.pathname.startsWith(link)}
								href={link}
							>
								{text}
							</Navbar.Link>
						</Link>
					))}
				</Navbar.Collapse>
			</Navbar>
		</div>
	);
}
