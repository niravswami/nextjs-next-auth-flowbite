import { CustomTextInput } from '@/components/CustomTextInput'
import AuthLayout from '@/components/layouts/AuthLayout'
import { CLOSE_EYE_SVG, OPEN_EYE_SVG } from '@/helpers/svgPath'
import { FULL_URL } from '@/helpers/urls'
import { IS_VALID_FN } from '@/helpers/validations/validationsFn'
import useAuth from '@/hooks/useAuth'
import { Alert, Button, Label } from 'flowbite-react'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'

export default function ResetPassword() {
    const { resetPassword } = useAuth()
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [formValues, setFormValues] = useState({
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

    const [status, setStatus] = useState('')

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

    const submitForm = event => {
        event.preventDefault()

        resetPassword({
            password: formValues.password.value,
            password_confirmation: formValues.confirmPassword.value,
            setErrors,
            setStatus,
            setIsLoading,
        })
    }
    const inputFields = [
        {
            id: 'password',
            type: show ? 'text' : 'password',
            label: 'New password',
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
            type: show ? 'text' : 'password',
            label: 'Confirm password',
            placeholder: '••••••••',
            isRequired: true,
            value: formValues.confirmPassword.value,
            addonEnd: (
                <span onClick={() => setShow(!show)}>
                    {show ? OPEN_EYE_SVG : CLOSE_EYE_SVG}
                </span>
            ),
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

    const isActionBtnDisabled =
        Object.values(formValues).filter(
            field => field.error !== '' || field.value === '',
        ).length > 0

    return (
        <AuthLayout>
            <Head>
                <title>Change Password</title>
            </Head>
            <span className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Change Password
            </span>
            <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                {status && (
                    <Alert color="failure">
                        <span>
                            <p>{status}</p>
                        </span>
                    </Alert>
                )}
                <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
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
                                </div>
                            </div>
                        )
                    })}
                    <Button
                        isProcessing={isLoading}
                        className="w-full"
                        onClick={submitForm}
                        disabled={isActionBtnDisabled || isLoading}>
                        Reset passwod
                    </Button>
                    <p className="flex justify-end text-sm font-light text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                            <Link href={FULL_URL.LOGIN}>
                                Login to your account
                            </Link>
                        </span>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}
