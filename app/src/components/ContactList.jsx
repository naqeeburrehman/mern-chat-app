import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAccessChatMutation } from "../features/chat/chatApiSlice";
import useAuth from "../hooks/useAuth";

const ContactList = ({ contacts, add }) => {
    if (contacts && contacts.ids.length > 0) {
        const { entities } = contacts;
        let contactCards = [];
        Object.keys(entities).forEach((key, index) => {
            contactCards.push(<ContactCard key={entities[key]._id} data={entities[key]} add={add} />);
        });
        return <div className="px-1 py-2">{contactCards}</div>;
    } else return null;
};

const ContactCard = ({ data, add }) => {
    const { id } = useAuth();
    const [accessChat, { isLoading }] = useAccessChatMutation();
    const navigate = useNavigate();

    const onAccessChat = async (userId) => {
        console.log(userId);
        try {
            await accessChat({ userId }).unwrap();
            navigate(`/chat/${data._id}`);
        } catch (err) {
            if (err) toast.error(err?.data?.message);
        }
    };

    let userData;

    if (!add) {
        data.users.forEach((user) => {
            if (id !== user._id) return (userData = user);
        });
    }

    return add ? (
        <div className="rounded-xl w-full bg-secondary-100  flex justify-between items-center mb-1 px-3 py-2">
            <div className="flex items-center">
                <Link to={`/profile/${data._id}`}>
                    <img className="w-12 h-12 rounded-full" src={data.img} alt="profile image" />
                </Link>
                <div className="pl-4 flex flex-col">
                    <span className="text-secondary-600 text-lg font-semibold">{data.name}</span>
                    <span className="text-primary-600 text-sm">{data.name}</span>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <span className="bg-secondary-200 rounded text-sm mx-2 px-2 py-1">{data.phone}</span>
                <button
                    type="button"
                    onClick={() => onAccessChat(data._id)}
                    className="bg-primary-600 hover:bg-primary-500 text-secondary-100 rounded p-2 "
                >
                    <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    ) : (
        <div className="rounded-xl bg-secondary-100 hover:bg-secondary-50 flex mb-1">
            <Link to={`${data.isGroupChat ? "/chat-details/" + data._id : "/profile/" + userData._id}`}>
                <img className="w-12 h-12 mx-3 my-2 rounded-full" src={userData.img} alt="profile image" />
            </Link>
            <Link to={`/chat/${data._id}`} className="w-full flex justify-between items-center px-3 py-2">
                <div className="flex items-center">
                    <div className="pl-4 flex flex-col">
                        <span className="text-secondary-600 text-lg font-semibold">
                            {data.isGroupChat ? data.chatName : userData.name}
                        </span>
                        <span className="text-primary-600 text-sm">{userData.phone}</span>
                    </div>
                </div>
                <span className="bg-secondary-200 rounded text-sm px-2 py-1">
                    {data.latestMessage ? data.latestMessage : userData.phone}
                </span>
            </Link>
        </div>
    );
};

export default ContactList;
