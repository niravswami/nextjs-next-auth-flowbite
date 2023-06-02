'use client'
import AuthButtons from '@/components/AuthButtons'
import { CustomTextInput } from '@/components/CustomTextInput'
import AuthLayout from '@/components/layouts/AuthLayout'
import { CLOSE_EYE_SVG, OPEN_EYE_SVG } from '@/helpers/svgPath'
import { IS_VALID_FN } from '@/helpers/validations/validationsFn'
import useAuth from '@/hooks/useAuth'
import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react'
import { getCsrfToken } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'

export default function SignUp({ csrfToken }) {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [formValues, setFormValues] = useState({
        name: {
            value: '',
            error: '',
            isTouched: false,
        },
        email: {
            value: '',
            error: '',
            isTouched: false,
        },
        password: {
            value: '',
            error: '',
            isTouched: false,
        },
        confirmPassword: {
            value: '',
            error: '',
            isTouched: false,
        },
    })

    const [show, setShow] = useState(false)

    const handleChange = ({ value, fieldName }) => {
        setFormValues(prev => {
            return {
                ...prev,
                [fieldName]: {
                    ...formValues[fieldName],
                    value,
                    isTouched: true,
                },
            }
        })
    }

    const handleErrorState = ({ error, fieldName }) => {
        setFormValues(prev => {
            return {
                ...prev,
                [fieldName]: {
                    ...formValues[fieldName],
                    error,
                },
            }
        })
    }

    const setErrors = errorObj => {
        let newFormValues = structuredClone(formValues)
        Object.keys(newFormValues)
            .filter(key => Object.keys(errorObj).includes(key))
            .forEach(key => {
                newFormValues[key].error = errorObj[key]
            })
        setFormValues(newFormValues)
    }

    const isPasswordMatching = () => {
        if (formValues.confirmPassword.isTouched) {
            const password = formValues.password.value
            const confirmPassword = formValues.confirmPassword.value
            let error = ''
            if (confirmPassword && password !== confirmPassword) {
                error = 'passwords did not match '
            }
            handleErrorState({ error, fieldName: 'confirmPassword' })
        }
    }

    const isActionBtnDisabled =
        Object.values(formValues).filter(
            field => field.error !== '' || field.value === '',
        ).length > 0

    const submitForm = event => {
        event.preventDefault()

        register({
            name: formValues.name.value,
            email: formValues.email.value,
            password: formValues.password.value,
            password_confirmation: formValues.confirmPassword.value,
            // csrfToken,
            setErrors,
        })
    }

    const inputFields = [
        {
            id: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Jon Doe',
            isRequired: true,
            value: formValues.name.value,
            onBlur: () => {
                let val = formValues.name.value.trim()
                let error = ''
                if (val === '') {
                    error = 'name field is required'
                }
                handleErrorState({
                    error,
                    fieldName: 'name',
                })
            },
        },
        {
            id: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'name@example.com',
            isRequired: true,
            value: formValues.email.value,
            onBlur: () => {
                let val = formValues.email.value.trim()
                let error = ''
                if (val === '') {
                    error = 'email address is required'
                } else if (!IS_VALID_FN.email(val)) {
                    error = 'invalid email address'
                }
                handleErrorState({
                    error,
                    fieldName: 'email',
                })
            },
        },
        {
            id: 'password',
            type: show ? 'text' : 'password',
            label: 'Password',
            placeholder: '••••••••',
            isRequired: true,
            value: formValues.password.value,
            addonEnd: (
                <span onClick={() => setShow(!show)}>
                    {show ? OPEN_EYE_SVG : CLOSE_EYE_SVG}
                </span>
            ),
            onBlur: () => {
                let error = IS_VALID_FN.password(formValues.password.value)
                handleErrorState({
                    error,
                    fieldName: 'password',
                })
                isPasswordMatching()
            },
        },
        {
            id: 'confirmPassword',
            type: 'password',
            label: 'Confirm password',
            placeholder: '••••••••',
            isRequired: true,
            value: formValues.confirmPassword.value,
            onBlur: () => {
                let val = formValues.confirmPassword.value
                let error = ''
                if (val === '') {
                    error = 'confirm password is required'
                }
                handleErrorState({
                    error,
                    fieldName: 'confirmPassword',
                })
                isPasswordMatching()
            },
        },
    ]
    return (
        <>
            <AuthLayout>
                <Head>
                    <title>Register</title>
                </Head>

                <span
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    Create an account
                </span>
                <Card className="w-full sm:max-w-md ">
                    <form className="space-y-4 " action="#">
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
                                    <CustomTextInput
                                        id={field.id}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        required={field.isRequired}
                                        addonEnd={field.addonEnd}
                                        name={field.name}
                                        value={field.value}
                                        onChange={e => {
                                            handleChange({
                                                value: e.target.value,
                                                fieldName: field.id,
                                            })
                                        }}
                                        onBlur={field.onBlur}
                                        color={
                                            formValues[field.id].error
                                                ? 'failure'
                                                : 'gray'
                                        }
                                        helperText={
                                            formValues[field.id].error ? (
                                                <React.Fragment>
                                                    {formValues[field.id].error}
                                                    !
                                                </React.Fragment>
                                            ) : (
                                                ''
                                            )
                                        }
                                    />
                                    {/* <TextInput
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.isRequired}
                    value={field.value}
                    onChange={(e) => {
                      handleChange({
                        value: e.target.value,
                        fieldName: field.id,
                      });
                    }}
                    onBlur={field.onBlur}
                    color={formValues[field.id].error ? "failure" : "gray"}
                    helperText={
                      formValues[field.id].error ? (
                        <React.Fragment>
                          {formValues[field.id].error}!
                        </React.Fragment>
                      ) : (
                        ""
                      )
                    }
                  /> */}
                                </div>
                            )
                        })}

                        <div className="flex items-center gap-2">
                            {/* <Checkbox id="accept" defaultChecked={true} /> */}
                            <Label htmlFor="accept">
                                <div className="text-sm">
                                    <label
                                        htmlFor="terms"
                                        className="font-light text-gray-500 dark:text-gray-300">
                                        By proceeding, you agree to our{' '}
                                        <Link href="#">
                                            <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                                Terms and Conditions{' '}
                                            </span>
                                        </Link>
                                        and confirm you have read our{' '}
                                        <Link href="#">
                                            <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                                Privacy policy
                                            </span>
                                        </Link>
                                        .
                                    </label>
                                </div>
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isActionBtnDisabled}
                            onClick={submitForm}>
                            Sign up
                        </Button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/auth/login">
                                <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Login here
                                </span>
                            </Link>
                        </p>
                    </form>
                    {/* <div className="p-6 space-y-4 md:space-y-6 sm:p-8"></div> */}
                </Card>
            </AuthLayout>
        </>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}
