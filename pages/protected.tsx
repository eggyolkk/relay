import { useSession } from "next-auth/react";
import Link from "next/link";
import Router from "next/router";
import { useEffect } from "react";
import { signOut } from 'next-auth/react';

const Protected = () => {
    const { status, data } = useSession();

    useEffect(() => {
        console.log('data', data)
        if (status === 'unauthenticated') {
            Router.replace('/login');
        }
    }, [status])

    const logoutUser = async() => {
        await signOut();
    }

    if (status === 'authenticated') {
        return (
            <div>
                You are authorised to view this page! {JSON.stringify(data)}
                <button onClick={logoutUser}>Logout</button>
            </div>
        )
    }

    return (
        <div>
            <p>Loading</p>
        </div>
    )
}

export default Protected;