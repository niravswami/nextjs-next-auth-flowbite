import { NextResponse } from "next/server";
import { getCookie, getCookies } from "cookies-next";
import { getSession, signOut } from "next-auth/react";
import { verifyAuthToken } from "./lib/verifyAuthToken";
import { URI } from "./helpers/urls";

// This function can be marked `async` if using `await` inside
export default async function middleware(req) {
	const response = NextResponse.next();
	// const requestHeaders = new Headers(req.headers);
	// requestHeaders.set("x-hello-from-middleware1", "hello");
	// requestHeaders.set("x-hello-from-middleware2", "world!");
	// requestHeaders.set("user-agent", "New User Agent overriden by middleware!");
	const requestForNextAuth = {
		headers: {
			cookie: req.headers.get("cookie"),
		},
	};
	const session = await getSession({ req: requestForNextAuth });
	console.log("session middleware", session);

	if (session) {
		console.log(
			"vvv",
			req.nextUrl.pathname,
			!req.nextUrl.pathname.startsWith(`/${URI.VERIFY_EMAIL}`),
			["", null, undefined].includes(session?.user?.email_verified_at)
		);
		const token = session?.accessToken;
		const verifiedToken =
			token &&
			(await verifyAuthToken(`${token}`).catch((err) => {
				console.log("verifyAuthToken err", err);
				return false;
			}));
		console.log("verifiedToken", verifiedToken);
		if (!verifiedToken) {
			return NextResponse.redirect(new URL(`/${URI.SESSION_EXPIRE}`, req.url));
		}

		if (
			!req.nextUrl.pathname.startsWith(`/${URI.VERIFY_EMAIL}`) &&
			["", null, undefined].includes(session?.user?.email_verified_at)
		) {
			console.log("go to verify eamil from: ", req.nextUrl.pathname);
			return NextResponse.redirect(new URL(`/${URI.VERIFY_EMAIL}`, req.url));
		} else if (
			req.nextUrl.pathname.startsWith(`/${URI.VERIFY_EMAIL}`) &&
			!["", null, undefined].includes(session?.user?.email_verified_at)
		) {
			console.log("go to dashboard");
			return NextResponse.redirect(new URL(`/${URI.DASHBOARD}`, req.url));
		}
		console.log("req.nextUrl.pathname,", req.nextUrl.pathname);
		return response;
	} else {
		return NextResponse.redirect(new URL(`/${URI.LOGIN}`, req.url));
	}

	if (req.nextUrl.pathname.startsWith("/dashboard")) {
		if (session) {
			const token = session?.accessToken;
			const verifiedToken =
				token &&
				(await verifyAuthToken(`${token}`).catch((err) =>
					console.log("verifyAuthToken err", err)
				));

			console.log(
				"session middleware",
				session?.accessToken,
				"verifiedToken",
				verifiedToken
			);

			if (!verifiedToken) {
				signOut({ callbackUrl: "http://localhost:3000/auth/login" });
			}
			// return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
			return response;
		} else {
			return NextResponse.redirect(new URL("/blog", req.nextUrl));
		}
	}

	if (session) {
		const token = session?.accessToken;
		const verifiedToken =
			token &&
			(await verifyAuthToken(`${token}_`).catch((err) =>
				console.log("verifyAuthToken err", err)
			));

		console.log(
			"session middleware",
			session?.accessToken,
			"verifiedToken",
			verifiedToken
		);

		if (!verifiedToken) {
			return NextResponse.redirect(new URL("/blog", req.nextUrl));
		}
	} else {
		console.log("ee", req.nextUrl.pathname.startsWith("/auth/login"));
		// the user is not logged in, redirect to the sign-in page
		const signInPage = "/auth/login";
		// signInUrl.searchParams.append("callbackUrl", req.url);
		// return NextResponse.redirect(signInUrl);
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	const { pathname } = req.nextUrl;
	//   return NextResponse.redirect(new URL('/home', req.url));
	console
		.log
		// "req",
		// req,
		// "req.url",
		// req.url,
		// "nextUrl",
		// req.nextUrl,
		// "pathname",
		// pathname,
		// "req.cookies",
		// req.cookies,
		// req.cookies["next-auth.session-token"],
		// "request.cookies.get('nextjs')?.value;",
		// req.cookies.get("accessToken")?.value
		// "response",
		// response
		// 'req.headers.get("cookie"),',
		// req.headers.get("cookie")
		();
	// return response;
	//   return NextResponse.redirect(new URL(req.nextUrl.href, req.url));
}

export const config = {
	matcher: [
		"/verify-email/:path*",
		"/dashboard/:path*",
		"/user-profile/:path*",
	],
};
