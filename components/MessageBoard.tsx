import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useSession } from "next-auth/react";
import moment from "moment";
import MessageBubbles from "./common/MessageBubbles";

interface sessionUser {
    _id?: string | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
}

export default function MessageBoard() {
    const [message, setMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]);
    const { status, data } = useSession();

    useEffect(() => {
        // Retrieve all messages
        retrieveMessages();
    }, [])

    const retrieveMessages = async() => {
        const res = await fetch('/api/messages', {
            method: 'GET',
        })
        const retrieved = await res.json();
        setMessagesList(retrieved);
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        if (data) {
            const user = data.user as sessionUser;
            const userId = user._id;

            const newMessage = {
                user_id: userId,
                timestamp: moment().toDate(),
                message: message,
            }

            const res = await fetch('/api/messages', {
                method: 'POST',
                body: JSON.stringify(newMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data2 = await res.json();
            console.log("DATa", data2);

            if (res.ok && res.status === 200) {
                retrieveMessages();
            }

            setMessage('');
        }
    }

    return (
        <div className='message-board-wrapper'>
            <div className='message-bubbles-wrapper'>
                <MessageBubbles messages={messagesList}/>
            </div>
            <form className='message-form-wrapper' onSubmit={handleSubmit}>
                <input 
                    className='message-input'
                    type='textarea' 
                    value={message}
                    onChange={({ target }) => {setMessage(target.value)}} 
                    placeholder='Write a message...'   
                />
                <div className='send-wrapper'>
                    <SendIcon />
                    <input className='send-button' type='submit' value='Send'/>
                </div>
            </form>
        </div>
    )
}
