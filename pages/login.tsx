import { useState } from "react";
import { signIn } from 'next-auth/react';
import Router from "next/router";

const SignInPage = () => {
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });

    console.log(userInfo);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            username: userInfo.username,
            password: userInfo.password,
            redirect: false,
        });

        console.log(res);

        if (!res?.error && res?.status === 200) {
            Router.replace('/protected');
        }
    }

    return (
        <div>
            <h1>Login</h1>
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
                <input type='submit' value='Login' />
            </form>
        </div>
    )
}

export default SignInPage;