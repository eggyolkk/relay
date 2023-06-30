import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useSession } from "next-auth/react";
import moment from "moment";
import MessageBubbles from "./common/MessageBubbles";
import useSWR, { mutate } from 'swr';
import { Message, SessionUser } from "./types";
  
export default function MessageBoard() {
    const [mounted, setMounted] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [prevLatest, setPrevLatest] = useState<Message>();

    const [tempMessage, setTempMessage] = useState<String[]>([]);
    const [showTempMessage, setShowTempMessage] = useState(false);
    const { data } = useSession();

    useEffect(() => {
        // Retrieve all messages on page load
        getMessages();
    }, [])

    const getMessages = async() => {
        const res = await fetch('/api/messages/latest?count=50', {
            method: 'GET',
        })
        const retrieved = await res.json(); 
        setMessages(retrieved.reverse());
    }

    const latestMessagesFetcher = async() => {
        const res = await fetch(`/api/messages/latest?count=50`, {
            method: 'GET',
        })
        const retrieved = await res.json();
        setTempMessage([]);

        if (retrieved) { 
            setMessages(retrieved.reverse());
            setShowTempMessage(false);
        }
        return retrieved;
    }

    const { data: latestMessages } = useSWR('latestMessage5', latestMessagesFetcher, { refreshInterval: 10 });


    const fetcher = (...args: [
        "/api/messages", { method: string; body: string; headers: { 'Content-Type': string; }; }
    ]) => fetch(...args).then((res) => res.json());
    const { data: postMessage } = useSWR('/api/messages', fetcher);

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        if (data && message !== '') {
            const user = data.user as SessionUser;

            const newMessage = {
                user_id: user._id,
                username: user.username,
                timestamp: moment().toDate(),
                message: message,
            }

            setMessage('');

            await fetcher('/api/messages', {
                method: 'POST',
                body: JSON.stringify(newMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            mutate('/api/messages');

            // Set temporary message until latest message is fetched
            setShowTempMessage(true);
            const updatedTempMesages = tempMessage.concat(message);
            setTempMessage(updatedTempMesages);
        }
    }

    return (
        <div className='message-board-wrapper'>
            <div className='message-bubbles-wrapper'>
                <MessageBubbles 
                    messages={messages}
                    tempMessage={tempMessage}
                    showTempMessage={showTempMessage}
                    data={data!}
                />
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