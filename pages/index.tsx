import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Link from 'next/link';
import { useState } from 'react';

export default function Home () {
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        alert('submit');
    }

    return (
        <div className='homepage'>
            <div className='left-container'>
                <div className='logo'></div>
                <QuestionAnswerIcon className='speech-icon'/>
            </div>
            <div className='right-container'>
                <p className='welcome-text'>Welcome back!</p>
                <p className='subtext'>Log into your account</p>

                <form onSubmit={handleSubmit}>
                    <input
                        className='input-field username'
                        placeholder='username'
                    />
                    <input
                        className='input-field password'
                        placeholder='********'
                        type='password'
                    />
                    <input 
                        className='login-button' 
                        type='submit' 
                        value='Login' 
                    />
                </form>
                <Link href='/sign-up'>Don't have an account? <b>Create one here</b></Link>
                
                <a href='https://github.com/eggyolkk/relay' target='/blank' className='github-link'>
                    GitHub
                </a>
            </div>
        </div>
    )
}