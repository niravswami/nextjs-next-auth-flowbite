import React, { useEffect, useState } from 'react'
import { getSession, signIn } from 'next-auth/react'

export default function AdminHome() {
    const [isLodaing, setIsLoading] = useState(true)
    useEffect(() => {
        const isLoggedIn = async () => {
            const session = await getSession()
            if (!session) {
                signIn()
            }
            setIsLoading(false)
        }
        isLoggedIn()
    }, [])

    return <>{isLodaing ? <h1>Loading</h1> : <div>AdminHome</div>}</>
}
