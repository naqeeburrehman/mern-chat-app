import { useState } from "react";
import ChatWindow from "../../components/ChatWindow";
import Navbar from "../../components/Navbar";

const Chat = () => {

    const [chats, setChats] = useState([
        { id: "03060595818", name: "Naqeeb", status: true, type: "group" },
        { id: "03135743707", name: "Khaqan", status: false, type: "group" },
    ]);

    return (
        <section>
            <Navbar path={"/"} title={"Chat"} />
            <ChatWindow chat={chats} />
        </section>
    );
};

export default Chat;
