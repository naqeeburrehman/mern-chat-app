import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

const ChatWindow = () =>  {
    const { socket } = useOutletContext();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const {id} = useParams()
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return;
        socket.on("message-from-server", (data) => {
            setChat((prev) => [...prev, { message: data.message, received: true }]);
        });
        socket.on("typing-start-from-server", () => {
            setTyping(true);
        });
        socket.on("typing-stop-from-server", () => {
            setTyping(false);
        });
    }, [socket]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.length <= 0) return;
        socket.emit("send-message", { message ,id});
        setChat((prev) => [...prev, { message, received: false }]);
        scrollToBottom();
        setMessage("");
    };

    const onTyping = (e) => {
        setMessage(e.target.value);
        if (!typingTimeout) {
            socket.emit("typing-start",{id});
        }
        clearTimeout(typingTimeout);
        setTypingTimeout(
            setTimeout(() => {
                setTypingTimeout(null);
                socket.emit("typing-stop",{id});
            }, 1000)
        );
    };

    return (
        <section className="bg-[url('./assets/bg.png')] bg-fixed bg-white w-full min-h-screen">
            <div className=" bg-red-600 h-16 flex flex-col justify-center items-center fixed w-full">
                <Link to="/">
                    <b className="absolute pl-5 py-2 left-0 text-white text-xl">{"<-"}</b>
                </Link>
                <h2 className="text-white text-2xl">{id ? id : null}</h2>
                <p className="text-white">{typing ? "Typing..." : "Inbox"}</p>
            </div>
            <div className="flex flex-col justify-start  mx-3 pt-24 pb-24">
                {chat.map((text) => (
                    <span className={`${text.received ? "pr-10" : "pl-10"}`}>
                        <p
                            className={`rounded-lg p-1 px-3 mt-1 w-fit ${
                                text.received ? "mr-auto bg-gray-200" : "ml-auto bg-red-600 text-white"
                            }`}
                            key={text.message}
                        >
                            {text.message}
                        </p>
                    </span>
                ))}
            </div>
            <div ref={chatEndRef} className=" w-full h-5" />
            <form className="flex flex-col bg-white fixed bottom-0 w-full p-5" onSubmit={sendMessage}>
                <div className="flex-1 flex">
                    <input
                        className="flex-1 rounded-full bg-gray-200 p-3 outline-none pl-4"
                        value={message}
                        onChange={onTyping}
                    />
                    <button className="rounded-full bg-red-600 text-white px-4 ml-1" type="submit">
                        Send
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ChatWindow