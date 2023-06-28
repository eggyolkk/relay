import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loading from '../components/Loading';

export default function Home () {
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { status, data } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            Router.replace('/dashboard');
        }
    }, [status])

    const clearErrors = () => {
        setUsernameError('');
        setPasswordError('');
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            username: userInfo.username,
            password: userInfo.password,
            redirect: false,
        });

        // Redirect to dashboard if login successful
        if (!res?.error && res?.status === 200) {
            clearErrors();
            Router.replace('/dashboard');
        }
        else {
            setPasswordError('Username or password is incorrect.');
        }
    }

    return (
        <div className='main-wrapper'>
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
                            <p className='welcome-text'>Welcome back!</p>
                            <p className='subtext'>Log into your account</p>

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
                                    value='Login' 
                                />
                            </form>
                            <Link href='/sign-up'>Don't have an account? <b>Create one here</b></Link>
                        </motion.div>
                        
                        <a href='https://github.com/eggyolkk/relay' target='/blank' className='github-link'>
                            GitHub
                        </a>
                    </div>
                </>
            :
                <Loading />
            }
        </div>
    )
}