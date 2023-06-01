import { FULL_URL } from "@/helpers/urls";
import { Badge, Button, Card, Navbar } from "flowbite-react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const router = useRouter();
	return (
		<section className="bg-white dark:bg-gray-900">
			<Navbar fluid rounded>
				<Navbar.Brand href="/">
					<img
						alt="Flowbite React Logo"
						className="mr-3 h-6 sm:h-9"
						src="https://flowbite.com/docs/images/logo.svg"
					/>
					<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
						Flowbite React
					</span>
				</Navbar.Brand>
				<div className="flex md:order-2 gap-2">
					<Button onClick={() => router.push(FULL_URL.LOGIN)}>Login</Button>
					<Button color="light" onClick={() => router.push(FULL_URL.SIGNUP)}>
						Sign up
					</Button>
				</div>
			</Navbar>
			<div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
				<h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
					Nextjs, Next-Auth, Tailwind, Flowbite
				</h1>
				<p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
					This is the boiler plate for morden development including Redux, React
					Notification etc.
				</p>
			</div>
		</section>
	);
}
