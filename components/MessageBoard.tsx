import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useSession } from "next-auth/react";
import moment from "moment";
import MessageBubbles from "./common/MessageBubbles";
import useSWR, { mutate } from 'swr';
import { Message, SessionUser } from "./types";
  
export default function MessageBoard() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const [tempMessage, setTempMessage] = useState<String[]>([]);
    const [showTempMessage, setShowTempMessage] = useState(false);
    const { data } = useSession();

    useEffect(() => {
        getMessages();
    }, [])

    // Retrieve all messages on page load
    const getMessages = async() => {
        const res = await fetch('/api/messages/latest?count=50', {
            method: 'GET',
        })
        const retrieved = await res.json(); 
        setMessages(retrieved.reverse());
    }

    // Retrieve most recent messages
    const latestMessagesFetcher = async() => {
        const res = await fetch(`/api/messages/latest?count=50`, {
            method: 'GET',
        })
        const retrieved = await res.json();
        setTempMessage([]);

        // Only set state if there is/are new messages
        if (JSON.stringify(retrieved.reverse()) !== JSON.stringify(messages)) {
            setMessages(retrieved);
            setShowTempMessage(false);
        }

        return retrieved;
    }

    const { data: latestMessages } = useSWR('latestMessages', latestMessagesFetcher, { refreshInterval: 800, dedupingInterval: 800 });

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
            const updatedTempMesages = tempMessage.concat(message);
            setTempMessage(updatedTempMesages);
            setShowTempMessage(true);
        }
    }

    return (
        <div className='message-board-wrapper'>
            <MessageBubbles 
                messages={messages}
                tempMessage={tempMessage}
                showTempMessage={showTempMessage}
                data={data!}
            />
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