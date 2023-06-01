import "react-toastify/dist/ReactToastify.min.css";
import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { Flowbite, useTheme } from "flowbite-react";
import { ToastContainer } from "react-toastify";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const theme = useTheme();

	return (
		<Provider store={store}>
			<SessionProvider session={session} refetchOnWindowFocus={false}>
				<Flowbite theme={theme}>
					<Component {...pageProps} />
					<ToastContainer />
				</Flowbite>
			</SessionProvider>
		</Provider>
	);
}
