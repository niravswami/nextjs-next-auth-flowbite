import { SOMETHING_WENT_WRONG_TRY_AGAIN } from '@/helpers/errorMsg'
import axios from '@/lib/axios'
import { errorWhileAuthMutate } from '@/redux/slices/authSlice'
import { getCsrfToken, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import useSWR from 'swr'

export default function useAuth(props) {
    const router = useRouter()
    const dispatch = useDispatch()

    const login = async ({ setErrors, setStatus, ...props }) => {
        setErrors([])
        setStatus(null)
        await axios
            .post('/user/login', props)
            .then(res => res)
            .catch(error => {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors)
                } else {
                    dispatch(
                        errorWhileAuthMutate({
                            status: error?.response?.status,
                            errorMsg:
                                error?.response?.data?.message ||
                                'something went worng! please try again after ',
                        }),
                    )
                }
            })
    }

    const register = async ({ setErrors, ...props }) => {
        setErrors([])

        await axios
            .post('/user/register', props)
            .then(res => res)
            .catch(error => {
                if ([422].includes(error.response.status)) {
                    setErrors(error.response.data.errors)
                } else if ([400].includes(error.response.status)) {
                    setErrors(error.response.data)
                } else {
                    dispatch(
                        errorWhileAuthMutate({
                            status: error?.response?.status,
                            errorMsg:
                                error?.response?.data?.message ||
                                'something went worng! please try again after ',
                        }),
                    )
                }
            })
    }

    const resendEmailVerification = async ({ setStatus }) => {
        await axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async ({ session = {} }) => {
        let response = await axios({ session })
            .post('/user/logout')
            .then(res => res)
            .catch(err => err.response)

        if ([200, 401].includes(response?.status)) {
            await signOut()
            window.location.pathname = '/auth/login'
        } else {
            toast.error(SOMETHING_WENT_WRONG_TRY_AGAIN)
        }
    }

    const forgotPassword = async ({
        setErrors,
        setStatus,
        email,
        setisLoading,
    }) => {
        setErrors([])
        setStatus(null)
        setisLoading(true)

        let response = await axios({})
            .post('/forgot-password', { email })
            .then(response => response.data)
            .catch(error => error.response)

        setisLoading(false)

        if (response?.success) {
            setStatus(response?.data?.status)
        } else {
            if (response?.status !== 422) throw error
            setErrors(response.data.errors)
        }
    }

    const resetPassword = async ({
        setErrors,
        setStatus,
        setIsLoading,
        ...props
    }) => {
        setErrors([])
        setStatus(null)
        setIsLoading(true)

        await axios({})
            .post('/reset-password', {
                token: router.query.token,
                ...props,
                email: router.query.email,
            })
            .then(res =>
                router.replace('/auth/login?reset=' + btoa(res.data.status)),
            )
            .catch(error => {
                setIsLoading(false)
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.msg)
            })
    }

    return {
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
