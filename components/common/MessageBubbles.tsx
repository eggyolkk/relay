interface Message {
    _id: number;
    user_id: number;
    timestamp: string;
    message: string;
}

interface MessageArray {
    messages: Array<Message>
}

export default function MessageBubbles(messageList: any) {
    const messages = messageList.messages;

    console.log("messagebubbles", messages)

    return (
        <div className='bubbles'>
            {messages?.map(function(message: Message, i: number){
                return <p className='message-bubble'key={i}>{message.message}</p>
            })}
        </div>
    )
}