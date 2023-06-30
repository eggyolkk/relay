import { Session } from "next-auth";
import { useEffect, useRef } from "react";
import { Message, SessionUser } from "../types";

interface MessageBubblesProps {
    messages: Message[],
    tempMessage: String[],
    showTempMessage: boolean,
    data: Session,
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
    }, [messages]);    

    return (
        <div className='message-bubbles-wrapper'>
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
        </div>
    )
}