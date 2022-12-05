import { useState } from "react";
import ChatWindow from "../../components/ChatWindow";
import Navbar from "../../components/Navbar";

const Chat = () => {
    const [chat, setChat] = useState([
        { id: "03060595818", name: "Naqeeb", status: true, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: true },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: true },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: true },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: true },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: true },
    ]);

    return (
        <section>
            <Navbar path={"/"} title={"Chat"} />
            <ChatWindow chat={chat} />
        </section>
    );
};

export default Chat;
