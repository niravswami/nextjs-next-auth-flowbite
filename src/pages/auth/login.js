'use client'
import React, { useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { CustomTextInput } from '@/components/CustomTextInput'
import { IS_VALID_FN } from '@/helpers/validations/validationsFn'
import AuthLayout, {
    DEFAULT_AUTHLAYOUT_MODAL_PROPRS,
} from '@/components/layouts/AuthLayout'
import AuthButtons from '@/components/AuthButtons'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { errorWhileAuthMutate } from '@/redux/slices/authSlice'
import { Button, Label } from 'flowbite-react'
import { FULL_URL, URI } from '@/helpers/urls'
import { CLOSE_EYE_SVG, OPEN_EYE_SVG } from '@/helpers/svgPath'

export default function Login() {
    const router = useRouter()
    const dispatch = useDispatch()

    const [show, setShow] = useState(false)
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    })

    // const [shouldRemember, setShouldRemember] = useState(false);

    const [authLayoutModalProps, setAuthLayoutModalProps] = useState({
        ...DEFAULT_AUTHLAYOUT_MODAL_PROPRS,
    })

    const handleCloseAuthLayoutModal = () =>
        setAuthLayoutModalProps(DEFAULT_AUTHLAYOUT_MODAL_PROPRS)

    const inputFields = [
        {
            id: 'email',
            type: 'email',
            label: 'Email',
            name: 'email',
            value: formValues.email,
            placeholder: 'name@example.com',
            isRequired: true,
            addonEnd: null,
        },
        {
            id: 'password',
            type: show ? 'text' : 'password',
            label: 'Password',
            name: 'password',
            value: formValues.password,
            placeholder: '••••••••',
            isRequired: true,
            addonEnd: (
                <span onClick={() => setShow(!show)}>
                    {show ? OPEN_EYE_SVG : CLOSE_EYE_SVG}
                </span>
            ),
        },
    ]

    const formValidation = ({ name, value }) => {
        let newErrors = structuredClone(errors)
        newErrors[name] = ''
        if (value === '') {
            newErrors[name] = `${name} field is required`
        } else if (name === 'email' && !IS_VALID_FN.email(value)) {
            newErrors[name] = `invalid email address`
        }
        setErrors(newErrors)
    }

    const handleOnChange = e => {
        setFormValues(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
        formValidation({
            name: e.target.name,
            value: e.target.value,
        })
    }

    const handleSignInBtnClick = async event => {
        event.preventDefault()
        const res = await signIn('credentials', {
            redirect: false,
            ...formValues,
            callbackUrl: process.env.NEXT_PUBLIC_BASE_URL + '/dashboard',
        })

        if (res?.ok) {
            router.replace(res?.url)
        } else {
            let errObj =
                typeof res.error === 'string'
                    ? JSON.parse(res.error)
                    : res.error
            if (errObj.status === 422) {
                setErrors(errObj.error)
            } else {
                dispatch(
                    errorWhileAuthMutate({
                        status: errObj?.status || 500,
                        errorMsg: errObj?.error,
                    }),
                )
            }
        }
    }

    const isActionBtnDisabled =
        Object.values(formValues).filter(field => field === '').length > 0
    // || Object.values(errors).filter((error) => error !== "").length > 0;

    return (
        <>
            <AuthLayout
                authLayoutModalProps={authLayoutModalProps}
                handleCloseAuthLayoutModal={handleCloseAuthLayoutModal}>
                <Head>
                    <title>Login</title>
                </Head>
                <span className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    Sign in to your account
                </span>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="space-y-4" action="#">
                            <AuthButtons />
                            <div className="inline-flex items-center justify-center w-full">
                                <hr className="w-full h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
                                <span className="absolute px-3 font-medium text-gray-500 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">
                                    or
                                </span>
                            </div>

                            {inputFields.map(field => {
                                return (
                                    <div key={field.id}>
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor={field.id}
                                                value={field.label}
                                            />
                                        </div>
                                        <div>
                                            <CustomTextInput
                                                id={field.id}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                required={field.isRequired}
                                                addonEnd={field.addonEnd}
                                                name={field.name}
                                                value={field.value}
                                                onChange={handleOnChange}
                                                color={
                                                    errors && errors[field.id]
                                                        ? 'failure'
                                                        : 'gray'
                                                }
                                                helperText={
                                                    errors &&
                                                    errors[field.id] ? (
                                                        <React.Fragment>
                                                            {errors[field.id]}!
                                                        </React.Fragment>
                                                    ) : (
                                                        ''
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* <Checkbox
										id="remember"
										onChange={(event) =>
											setShouldRemember(event.target.checked)
										}
									/>
									<Label htmlFor="remember">
										<span className="text-gray-500 dark:text-gray-300">
											Remember me
										</span>
									</Label> */}
                                </div>
                                <span className="text-sm font-medium hover:underline text-gray-500 dark:text-gray-400">
                                    <Link href={FULL_URL.FORGOT_PASSWORD}>
                                        Forgot password?
                                    </Link>
                                </span>
                            </div>
                            <Button
                                isProcessing={false}
                                type="submit"
                                className="w-full"
                                onClick={e => handleSignInBtnClick(e)}
                                disabled={isActionBtnDisabled}>
                                Sign in
                            </Button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don&apos;t have an account yet?{' '}
                                <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    <Link href={'/auth/signup'}>Sign up</Link>
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </AuthLayout>
        </>
    )
}
