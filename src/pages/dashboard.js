import axios from '@/lib/axios'
import React from 'react'
import UserLayout from '@/components/layouts/UserLayout'

export default function dashboard({ data }) {
    return (
        <UserLayout>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
            </div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            </div>
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
                <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            </div>
        </UserLayout>
    )
}

// This gets called on every request
export async function getServerSideProps({ req, res }) {
    let response
    // Fetch data from external API
    response = await axios({ req })
        .get('/dashboard')
        .then(resp => resp?.data)
        .catch(err => {
            if (response && err?.response?.status === 401) {
                return {
                    redirect: {
                        permanent: false,
                        destination: '/auth/logout',
                    },
                    props: {},
                }
            }
        })
    const data = {
        dashboardData: {
            name: 'Nirav',
        },
    }

    // Pass data to the page via props
    return { props: { data } }
}
