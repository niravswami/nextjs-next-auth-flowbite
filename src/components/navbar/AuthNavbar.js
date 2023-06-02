import React, { useContext } from 'react'
import { DarkThemeToggle, Navbar, Tooltip } from 'flowbite-react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthLayoutContext } from '@/context/AuthLayoutContext/AuthLayoutContextProvider'

export default function AuthNavbar() {
    return (
        <Navbar fluid={true}>
            <Link href={'/'} legacyBehavior>
                <Navbar.Brand href={'#'}>
                    <>
                        <Image
                            src="https://flowbite.com/docs/images/logo.svg"
                            className="mr-2 h-6 sm:h-9 w-8"
                            alt="Flowbite Logo"
                            height="10"
                            width="15"
                        />
                        <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white">
                            Flowbite
                        </span>
                    </>
                </Navbar.Brand>
            </Link>
            <Tooltip content="Toggle dark mode">
                {/* <DarkThemeToggle /> */}
            </Tooltip>
        </Navbar>
    )
}
