import React, {useState, useEffect} from 'react'
import axios from 'axios'
// @ts-ignore
import TagManager from 'react-gtm-module'
import FeedbackForm from "./FeedbackForm";
import {ClipLoader} from "react-spinners";

const tagManagerArgs = {
    gtmId: 'G-922DE7HPS1'
}

TagManager.initialize(tagManagerArgs)

const BOT_IMG = 'https://cdn-icons-png.flaticon.com/512/7611/7611368.png'
const PERSON_IMG = 'https://cdn4.iconfinder.com/data/icons/neutral-character-traits-alphabet-c/236/neutral-c010-512.png'
const BOT_NAME = 'Wise Help AI'
const PERSON_NAME = 'You'

interface BotResponse {
    answer: string;
    urls_used: string[];
    n_tokens_used: number;
    id: number;
}

interface Message {
    name: string;
    side: 'left' | 'right';
    text: MessageContent;
    time: Date | string; // Use 'string' if the date will be stored as a string
}

type MessageContent =
    | {
    type: 'text'; data: string, id: number | undefined
}
    | { type: 'links'; data: string[], id: number | undefined }


const formatDate = (date: Date | string): string => {
    const d = (typeof date === 'string') ? new Date(date) : date
    const h = `0${d.getHours()}`.slice(-2)
    const m = `0${d.getMinutes()}`.slice(-2)
    return `${h}:${m}`
}

const getImage = (name: string) => {
    return name === BOT_NAME ? BOT_IMG : PERSON_IMG
}

const Chatbot = () => {
    const [messages, setMessages] = useState<Message[]>(() => {
        const localData = localStorage.getItem('messages')
        return localData ? JSON.parse(localData) : [
            {
                name: BOT_NAME,
                side: 'left',
                text: {type: 'text', data: 'How may I help You?'},
                time: new Date(),
            },
        ]
    })
    const [inputText, setInputText] = useState('')
    const [nTokensUsed, setNTokensUsed] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages))
    }, [messages])
    const appendMessage = (name: string, side: 'left' | 'right', text: MessageContent) => {
        const newMessage = {
            name,
            side,
            text,
            time: new Date(),
        }
        setMessages((prevMessages: any) => [...prevMessages, newMessage])
    }
    useEffect(() => {
        const login = async () => {
            try {
                const response = await axios.post(`/login`, {withCredentials: true});
                setNTokensUsed(response.data.n_tokens_used);

            } catch (error) {
                console.error('Error logging in', error);
            }
        };

        login();
    }, []);
    const botResponse = async (rawText: string) => {
        setIsLoading(true);
        const config = {params: {question: rawText}, withCredentials: true,};
        try {
            const response = await axios.get<BotResponse>('/answer', config)
            const data = response.data

            const msgText: MessageContent = {type: 'text', data: data.answer, id: data.id}
            appendMessage(BOT_NAME, 'left', msgText)

            if (data.urls_used.length > 0) {
                const msgLinks: MessageContent = {type: 'links', data: data.urls_used, id: undefined}
                appendMessage(BOT_NAME, 'left', msgLinks)
            }
            setNTokensUsed(data.n_tokens_used);
            setIsLoading(false);

        } catch (error) {
            console.error(error)
            setIsLoading(false);
        }
    }


    const handleResetSession = () => {
        setMessages([
            {
                name: BOT_NAME,
                side: 'left',
                text: {type: 'text', data: 'Session reset. How may I help you?', id: undefined},
                time: new Date(),
            },
        ]);
        localStorage.removeItem('messages');
        setNTokensUsed(0);
        axios.post(`/reset-session`, {withCredentials: true});

    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!inputText) return
        appendMessage(PERSON_NAME, 'right', {type: 'text', data: inputText, id: undefined})
        setInputText('')
        botResponse(inputText)
    }

    return (
        <section className="container">
            <h2 className="title">An LLM-powered Customer Support Agent for Wise</h2>
            <div className="n-tokens-used">
                {nTokensUsed} tokens used
                <div>
                    <button className="reset-session-btn" onClick={handleResetSession}>
                        Reset Session
                    </button>
                </div>
            </div>
            <section className="msger">
                <main className="msger-chat">
                    {messages.map((message: Message, index: React.Key) => (
                        <div key={index} className={`msg ${message.side}-msg`}>

                            <div className="msg-img-container">
                                <img className="msg-img" src={getImage(message.name)} alt="Profile"/>
                            </div>
                            <div className="msg-bubble">

                                <div className="msg-info">
                                    <div className="msg-info-name">{message.name}</div>
                                    <div className="msg-info-time">{formatDate(message.time)}</div>
                                    {message.name === BOT_NAME && message.text.id &&
                                        <FeedbackForm messageId={message.text.id}/>}
                                </div>
                                <div className="msg-text">
                                    {message.text.type === 'text' && message.text.data.split('\n').map((item, key) => {
                                        return <span key={key}>{item}<br/></span>
                                    })}

                                    {message.text.type === 'links' && (
                                        <>
                                            <div>These help articles were used to answer your question:</div>
                                            {message.text.data.map((url, index) => (<>
                                                    <a key={index} href={url} target="_blank"
                                                       rel="noopener noreferrer">{url}</a><br/>
                                                </>
                                            ))}
                                        </>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </main>
                {!isLoading && <form className="msger-inputarea" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="msger-input"
                        placeholder="Enter your message..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                    />
                    <button type="submit" className="msger-send-btn">
                        Send
                    </button>
                </form>}
                {isLoading && <div className="spinner-container"><ClipLoader color="#4A90E2" size={50} /></div>}
            </section>
            <footer className="footer">
                <>
                    This is a private project, with no affiliation to Wise.
                    <br/>
                    It is using ONLY publicly available information at{' '}
                    <a href="https://wise.com/help" target="_blank" rel="noopener noreferrer">
                        https://wise.com/help</a>.
                    <br/>
                    There's no point in asking it about your personal account details or transactions with Wise.
                    <br/>
                    Use it only for testing purposes.
                    All information entered will be stored for further improvements.
                </>
            </footer>
        </section>
    )
}


export default Chatbot
