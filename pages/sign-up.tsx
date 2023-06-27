import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Link from "next/link";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Router from "next/router";
import { signIn, useSession } from "next-auth/react";

const SignInPage = () => {
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { status, data } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            Router.replace('/dashboard');
        }
    }, [status])

    const isPasswordValid = () => {
        return userInfo.password.length > 6 ;
    }

    const clearErrors = () => {
        setUsernameError('');
        setPasswordError('');
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        const validPassword: boolean = isPasswordValid();
        if (validPassword) {
            clearErrors();
            const res = await fetch('../api/auth/user', {
                method: 'POST',
                body: JSON.stringify({ username: userInfo.username, password: userInfo.password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            // If registration successful, redirect to dashboard
            if (res.ok && res.status === 200) {
                const res = await signIn('credentials', {
                    username: userInfo.username,
                    password: userInfo.password,
                    redirect: false,
                });
                Router.replace('/dashboard');
            }
            // Else, display error message
            else {
                setUsernameError(res.statusText);
            }
        } 
        else {
            setPasswordError('Password must be at least 6 characters.');
        }
    }

    return (
        <div className='main-wrapper homepage'>
            {status === 'unauthenticated' ? 
                <>
                    <div className='left-container'>
                        <div className='logo'></div>
                        <QuestionAnswerIcon className='speech-icon'/>
                    </div>
                    <div className='right-container'>
                        <motion.div 
                            className='animate-div'
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: [0, 0.71, 0.2, 1.01]
                            }}
                        >
                            <p className='welcome-text'>Create Account</p>
                            <p className='subtext'>Just fill in a couple details and you're good to go!</p>

                            <form onSubmit={handleSubmit}>
                                <div className='input-container'>
                                    <PersonIcon />
                                    <input
                                        className='input-field'
                                        placeholder='username'
                                        onChange={({ target }) => setUserInfo({ ...userInfo, username: target.value })}
                                    />
                                    <p className='error'>{usernameError}</p>
                                </div>
                                
                                <div className='input-container'>
                                    <KeyIcon />
                                    <input
                                        className='input-field'
                                        placeholder='********'
                                        type='password'
                                        onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
                                    />
                                    <p className='error'>{passwordError}</p>
                                </div>
                                
                                <input 
                                    className='login-button' 
                                    type='submit' 
                                    value='Create account' 
                                />
                            </form>
                            <Link href='/'>Have an account? <b>Log In</b></Link>
                        </motion.div>
                        
                        <a href='https://github.com/eggyolkk/relay' target='/blank' className='github-link'>
                            GitHub
                        </a>
                    </div>
                </>
            :
                <h1>Loading</h1>
            }
        </div>
    )
}

export default SignInPage;