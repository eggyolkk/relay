import { useSession } from "next-auth/react";
import Link from "next/link";
import Router from "next/router";
import { useEffect } from "react";
import { signOut } from 'next-auth/react';
import Servers from "../components/Servers";
import MessageBoard from "../components/MessageBoard";

const Dashboard = () => {
    const { status, data } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            Router.replace('/');
        }
    }, [status])

    const logoutUser = async() => {
        await signOut();
    }

    if (status === 'authenticated') {
        return (
            <div className='main-wrapper'>
                <Servers />
                <h4 onClick={logoutUser}>Logout</h4>
                <MessageBoard />
            </div>
        )
    }

    return (
        <div className='main-wrapper'>
            <p>Loading</p>
        </div>
    )
}

export default Dashboard;