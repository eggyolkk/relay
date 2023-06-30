import { Session } from "next-auth";
import { useEffect, useRef } from "react";
import { Message, SessionUser } from "../types";
import moment from "moment";

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

    const convertToDate = (timestamp: string) => {
        const dateObj = new Date(timestamp);
        const momentObj = moment(dateObj);
        const momentString = momentObj.format('DD/MM/YY h:mm');

        const isToday = momentObj.isSame(moment(), "day");
        const isYesterday = momentObj.isSame(moment().subtract(1, 'day'), "day");

        if (isToday) {
            const momentString = momentObj.format('LT');
            return momentString;
        }
        else if (isYesterday) {
            const momentString = momentObj.format('LT');
            return "Yesterday at " + momentString;
        }

        return momentString;
    }

    return (
        <div className='message-bubbles-wrapper'>
            <div className='bubbles'>
                {messages[0]!==undefined ? 
                    <>
                        {messages.map(function(message: Message, i: number){
                            if (message.user_id === user._id) {
                                return (
                                    <div className='message-bubble user' key={i}>
                                        <div className='user-time-wrapper'>
                                            <p className='username'>{message.username}</p>
                                            <p className='date'>{convertToDate(message.timestamp)}</p>
                                        </div>
                                        <p className='text'>{message.message}</p>
                                        <div ref={bottomMessage}></div>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div className='message-bubble other' key={i}>
                                        <div className='user-time-wrapper'>
                                            <p className='username'>{message.username}</p>
                                            <p className='date'>{convertToDate(message.timestamp)}</p>
                                        </div>
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
                                        <div className='message-bubble user' key={i} ref={bottomMessage}>
                                            <div className='user-time-wrapper'>
                                                <p className='username'>{user.username}</p>
                                                <p className='date'>{convertToDate(moment().toString())}</p>
                                            </div>
                                            
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