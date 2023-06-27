import { useEffect, useState } from "react";
import { signIn } from 'next-auth/react';
import Router from "next/router";
import bcrypt from 'bcrypt';

const SignInPage = () => {
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });

    const handleSubmit = async(e) => {
        e.preventDefault();

        console.log(userInfo.username, userInfo.password)

        const res = await fetch('../api/auth/user', {
            method: 'POST',
            body: JSON.stringify({ username: userInfo.username, password: userInfo.password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("signup", res);
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    value={userInfo.username}
                    onChange={({ target }) => setUserInfo({ ...userInfo, username: target.value })}
                    placeholder='username'
                />
                <input
                    value={userInfo.password}
                    onChange={({target}) => setUserInfo({ ...userInfo, password: target.value })} 
                    type='password'
                    placeholder='******'
                />
                <input type='submit' value='Create account' />
            </form>
        </div>
    )
}

export default SignInPage;