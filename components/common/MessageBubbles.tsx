import { Session } from "next-auth";
import { useEffect, useRef } from "react";

interface Message {
    message: string,
    username: string,
    timestamp: string,
    user_id: string,
    _id: string
}

interface MessageBubblesProps {
    messages: Message[],
    tempMessage: String[],
    showTempMessage: boolean,
    data: Session,
}

interface SessionUser {
    exp: number,
    iat: number,
    jti: string,
    password: string,
    username: string,
    _id: string,
}

export default function MessageBubbles(props: MessageBubblesProps) {
    const { messages, tempMessage, showTempMessage, data } = props;
    const bottomMessage = useRef<null | HTMLDivElement>(null);
    const user = data.user as SessionUser;

    // Keep screen scrolled to latest message
    const scrollToBottom = () => {
        bottomMessage?.current?.scrollIntoView()
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, tempMessage]);    

    return (
        <div className='bubbles'>
            {messages[0]!==undefined ? 
                <>
                    {messages.map(function(message: Message, i: number){
                        if (message.user_id === user._id) {
                            return (
                                <div className='message-bubble-user' key={i}>
                                    <p className='user'>{message.username}</p>
                                    <p className='text'>{message.message}</p>
                                    <div ref={bottomMessage}></div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className='message-bubble-other' key={i}>
                                    <p className='user'>{message.username}</p>
                                    <p className='text'>{message.message}</p>
                                    <div ref={bottomMessage}></div>
                                </div>
                            )
                        }
                    })}
                    {showTempMessage && tempMessage ? 
                        <>
                            {tempMessage.map(function(message: String, i: number) {
                                return (
                                    <div className='message-bubble-user' key={i} ref={bottomMessage}>
                                        <p className='user'>{user.username}</p>
                                        <p className='text'>{message}</p>
                                        <div ref={bottomMessage}></div>
                                    </div>
                                )
                            })}
                        </>
                    :
                        null
                    }
                </>
            :
                null
            }
            
        </div>
    )
}