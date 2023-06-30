import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useSession } from "next-auth/react";
import moment from "moment";
import MessageBubbles from "./common/MessageBubbles";
import useSWR from 'swr';

interface Message {
    message: string,
    username: string,
    timestamp: string,
    user_id: string,
    _id: string
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: {
        username: string,
        _id: string,
      }
    }
  }

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
        setMessages(retrieved);
    }

    // Fetch latest message and add to array of existing messages
    // (Don't want to request for the whole array every time)
    const latestMessageFetcher = async() => {
        // REDO LATER
        const count = tempMessage.length === 0 ? 1 : tempMessage.length;
        const res = await fetch(`/api/messages/latest?count=${count}`, {
            method: 'GET',
        })
        const retrieved = await res.json();
        // Once latest data fetched, hide temporary message and return retrieved data
        if (retrieved) {
            setShowTempMessage(false);
        }
        // Check if the current fetch has the same value as the last fetched item
        if (prevLatest !== retrieved[0]) {
            setPrevLatest(retrieved[0]);
        }
        return retrieved;
    }

    const latestMessageFetcher5 = async() => {
        // REDO LATER
        const res = await fetch(`/api/messages/latest?count=50`, {
            method: 'GET',
        })
        const retrieved = await res.json();
        setTempMessage([]);

        if (retrieved) { 
            setMessages(retrieved);
            setShowTempMessage(false);
        }
        return retrieved;
    }

    const { data: latestMessage } = useSWR('latestMessage', latestMessageFetcher, { refreshInterval: 100 });
    const { data: latestMessage5 } = useSWR('latestMessage5', latestMessageFetcher5, { refreshInterval: 100 });


    useEffect(() => {
        if (latestMessage5) {
            /*
            //const sliced = messages.slice(0, -5);
            //const updated = sliced.concat(latestMessage5.reverse());
            //setMessages(updated);

            let newArr = [ ...messages ];

            /*
            messages.forEach((message) => {
                const existingIndex = latestMessage5.find(a => a._id === message._id);
                if (existingIndex >= 0) {
                    newArr[existingIndex] = existingIndex;
                }
                else {
                    newArr.push(latestMessage5);
                }
            })
            

            
            for (let i=0; i<messages.length; i++) {
                for (let j=0; j<latestMessage5.length; j++) {
                    const exists = latestMessage5[j]._id === messages[i]._id;

                    if (exists) {
                        messages[i] = latestMessage5[j];
                    }
                    else {
                        newArr.push(latestMessage5[j])
                    }
                }
            }

            console.log("new arr2", newArr);

            setMessages(newArr);

            setTempMessage([]);
            */
        }
    }, [latestMessage5])


    const handleSubmit = async(e: any) => {
        e.preventDefault();

        if (data && message !== '') {
            const userId = data.user._id;
            const username = data.user.username;

            const newMessage = {
                user_id: userId,
                username: username,
                timestamp: moment().toDate(),
                message: message,
            }

            setMessage('');

            await fetch('/api/messages', {
                method: 'POST',
                body: JSON.stringify(newMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            // Set temporary message until latest message is fetched
            setShowTempMessage(true);
            const updatedTempMesages = tempMessage.concat(message);
            console.log("temp", updatedTempMesages)
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