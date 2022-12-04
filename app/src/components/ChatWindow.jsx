import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ChatWindow = ({ chat }) => {
    const [typing, setTyping] = useState(false);
    const [message, setMessage] = useState("");
    const { id } = useParams();
    const chatEndRef = useRef(null);

    const onSendMessage = (e) => {
        e.preventDefault();
        console.log("message sent");
    };

    const onTyping = (e) => {
        setMessage(e.target.value);
    };

    return (
        <div className="bg-[url('./assets/bg.png')] bg-fixed bg-white w-full min-h-screen">
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
            <form className="flex flex-col bg-white fixed bottom-0 w-full p-5" onSubmit={onSendMessage}>
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
        </div>
    );
};

export default ChatWindow;
