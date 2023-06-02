import AuthLayout from '@/components/layouts/AuthLayout'
import { API_URL, FULL_URL, URI } from '@/helpers/urls'
import { Alert, Button } from 'flowbite-react'
import { signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useDispatch } from 'react-redux'
import { errorWhileAuthMutate } from '@/redux/slices/authSlice'
import useAuth from '@/hooks/useAuth'

export default function VerifyEmail(props) {
    const { alertData } = props
    const dispatch = useDispatch()
    const { data: sessionData, update } = useSession()
    const { logout } = useAuth()
    const router = useRouter()

    const [isLinkResend, setIsLinkResend] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)

    const updateUserAndRedirect = async user => {
        let newUser = { ...sessionData.user, ...user }
        await update({ ...sessionData, user: { ...newUser } })
        await router.replace(`/${URI.DASHBOARD}`)
    }

    useEffect(() => {
        if (props?.isVerified && sessionData && sessionData.user) {
            updateUserAndRedirect(props?.user)
        }
    }, [router, sessionData, props])

    const handleResendLink = async () => {
        setIsLinkResend(false)
        setResendLoading(true)
        let response = await axios({ req: {} })
            .post(API_URL.SEND_EMAIL_VERIFICATION_LINK, {
                headers: {
                    Authorization: `Bearer ${sessionData?.accessToken}`,
                },
            })
            .then(res => res)
            .catch(err => err.response)

        if (response?.status === 200) {
            setIsLinkResend(true)
        } else {
            dispatch(
                errorWhileAuthMutate({
                    status: response?.status,
                    errorMsg:
                        response?.data?.msg ||
                        'something went worng! please try again after ',
                }),
            )
        }

        setResendLoading(false)
    }

    return (
        <>
            <AuthLayout>
                <Head>
                    <title>verify email</title>
                </Head>
                <span className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    Verify email address
                </span>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {alertData?.isShow && (
                            <Alert color="failure">
                                <span>
                                    <span className="font-medium">
                                        {alertData?.boldText}
                                    </span>{' '}
                                    {alertData?.text}
                                </span>
                            </Alert>
                        )}
                        <div className="mb-4 text-sm text-gray-600">
                            Thanks for signing up! Before getting started, could
                            you verify your email address{' '}
                            <strong>{sessionData?.user?.email}</strong> by
                            clicking on the link we just emailed to you? If you
                            didn&apos;t receive the email, we will gladly send
                            you another.
                        </div>
                        {isLinkResend && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                A new verification link has been sent to the
                                email address you provided during registration.
                            </div>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                            <Button
                                onClick={handleResendLink}
                                isProcessing={resendLoading}
                                disabled={resendLoading}>
                                Resend Verification Email
                            </Button>

                            <Button
                                disabled={resendLoading}
                                color="light"
                                onClick={() =>
                                    logout({
                                        session: sessionData,
                                    })
                                }>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    )
}

export async function getServerSideProps({ req, res, query, ...rest }) {
    let alertData = {
        isShow: false,
        boldText: '',
        text: `It looks like the verification link has expired. Please request a new verification link to complete the email verification process`,
    }

    let isVerified = false
    let user = {}

    if (Object.keys(query).length > 0) {
        let userId = query?.['verify-email']?.[0] || null
        let hash = query?.['verify-email']?.[1] || null
        let expires = query?.expires
        let currentTime = Math.floor(new Date().getTime() / 1000.0)
        let isLinkExpired = false

        if (!userId || !hash || !expires) {
            alertData.isShow = true
            alertData.boldText = 'Invalid link!'
        } else {
            isLinkExpired = currentTime > expires
            if (isLinkExpired) {
                alertData.isShow = true
                alertData.boldText = 'Oops! Link expired'
            } else {
                let response = await axios({ req })
                    .get(rest.resolvedUrl)
                    .then(resp => resp?.data)
                    .catch(err => err?.response)

                if (!response?.success) {
                    if (response?.status === 401) {
                        return {
                            redirect: {
                                permanent: false,
                                destination: FULL_URL.SESSION_EXPIRE,
                            },
                            props: {},
                        }
                    } else {
                        alertData.isShow = true
                        alertData.boldText = 'Oops!'
                        alertData.text = response?.data?.msg
                    }
                } else {
                    isVerified = true
                    user = response?.data?.user
                }
            }
        }
    }

    const data = {
        alertData,
        isVerified,
        user,
    }

    // Pass data to the page via props
    return { props: { ...data } }
}
