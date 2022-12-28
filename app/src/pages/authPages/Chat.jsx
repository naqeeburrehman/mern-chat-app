import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../../components/ChatWindow";
import Navbar from "../../components/Navbar";

const Chat = () => {
    const [chat, setChat] = useState([
        { id: "03060595818", name: "Naqeeb", status: true, message: "asfasdad", received: false },
        { id: "2", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "3", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "4", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "5", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "6", name: "Khaqan", status: false, message: "asfasdad", received: true },
        { id: "7", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "8", name: "Khaqan", status: false, message: "asfasdad", received: true },
        { id: "9", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "0", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "-", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "=", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "22", name: "Khaqan", status: false, message: "asfasdad", received: true },
        { id: "03135743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "33", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "44", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "23", name: "Khaqan", status: false, message: "asfasdad", received: true },
        { id: "123", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "213", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "asd", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "0313daw5743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "0313awdas5743707", name: "Khaqan", status: false, message: "asfasdad", received: false },
        { id: "03135awd743707", name: "Khaqan", status: false, message: "asfasdad", received: true },
    ]);

    const { id } = useParams();

    return (
        <section>
            <Navbar path={"/"} title={"Chat Details"} titleLink={`/chat-details/${id}`} />
            <ChatWindow chat={chat} />
        </section>
    );
};

export default Chat;
