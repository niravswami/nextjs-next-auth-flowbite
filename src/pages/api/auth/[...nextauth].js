import NextAuth from 'next-auth'
// import Providers from "next-auth/providers";
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialProvider from 'next-auth/providers/credentials'
import axios from '@/lib/axios'
import { cookies } from 'next/headers'
import { setCookie } from 'cookies-next'
import { URI } from '@/helpers/urls'

export const authOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24,
    },
    jwt: {
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // maxAge: 60 * 60 * 24,
        // maxAge: 5,
    },
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialProvider({
            id: 'credentials',
            name: 'credentials',
            type: 'credentials',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'jsmith@example.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials, req) => {
                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                }

                let user = null

                await axios({ req })
                    .post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL_V1}/user/login`,
                        payload,
                    )
                    .then(res => {
                        user = res?.data
                    })
                    .catch(err => {
                        let errObj = {
                            status: err?.response?.status || 500,
                            error: '',
                        }
                        if (errObj.status === 422) {
                            errObj.error = err.response.data.errors
                        } else {
                            errObj.error =
                                err?.response?.data?.message ||
                                'something went worng! please try again after '
                        }
                        throw new Error(JSON.stringify(errObj))
                    })
                return user
            },
        }),
    ],
    pages: {
        signIn: 'pages/auth/login',
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log('signIn', {
            //     user,
            //     account,
            //     profile,
            //     email,
            //     credentials,
            // })
            let isSignIn = false
            if (account?.provider === 'credentials') {
                isSignIn = true
                account.access_token = user?.access_token
                account.token_type = user?.token_type
                account.expires_in = user?.expires_in
                account.user = user?.user
            } else if (['github', 'google'].includes(account.provider)) {
                let oauth_id =
                    account.provider === 'google'
                        ? account?.providerAccountId
                        : profile?.id
                let postData = {
                    user: { ...user, provider: account.provider, oauth_id },
                }
                try {
                    await axios({ req: {} })
                        .post(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL_V1}/auth/${account.provider}/get-next-auth-jwt-token`,
                            postData,
                        )
                        .then(res => {
                            let data = res?.data
                            account.access_token = data?.access_token
                            account.token_type = data?.token_type
                            account.user = data?.user
                            isSignIn = true
                            return res
                        })
                        .catch(err => err)
                } catch (error) {
                    console.log('try error', error)
                }
            }
            return isSignIn
        },
        async redirect({ url, baseUrl }) {
            return url
        },
        async jwt({
            token,
            user,
            account,
            profile,
            isNewUser,
            trigger,
            session,
        }) {
            // console.log('jwt', {
            //     token,
            //     user,
            //     account,
            //     profile,
            //     isNewUser,
            //     trigger,
            //     session,
            // })

            if (trigger === 'update') {
                return { ...token, ...session }
            }
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.email_verified_at = user?.email_verified_at
                token.username = user?.username
                token.accessToken = token?.accessToken
                    ? token?.accessToken
                    : account?.access_token
                token.user = account?.user
            }
            return token
        },
        async session({ session, user, token }) {
            // console.log('next auth session', { session, user, token })
            session.accessToken = token?.accessToken
            session.user = token?.user
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    // Enable debug messages in the console if you are having problems
    debug: true,
}
export default NextAuth(authOptions)
