import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const ContactList = ({ contacts, add }) => {
    console.log("contactlist rendered");
    return (
        <div className="bg-secondary-200 px-1 py-2 min-h-screen">
            {contacts.map((contact) => (
                <ContactCard key={contact.id} data={contact} add={add} />
            ))}
        </div>
    );
};

const ContactCard = ({ data, add }) => {
    return add ? (
        <div className="rounded-xl w-full bg-secondary-100  flex justify-between items-center mb-1 px-3 py-2">
            <div className="flex items-center">
                <img className="w-12 h-12 rounded-full" src={data.img} alt="profile image" />
                <div className="pl-4 flex flex-col">
                    <span className="text-secondary-600 text-lg font-semibold">{data.name}</span>
                    <span className="text-primary-600 text-sm">{data.name}</span>
                </div>
            </div>
            <span className="bg-secondary-200 rounded px-2 py-1">{data.phone}</span>
            <button className="bg-primary-800 text-secondary-100 rounded p-2 hover:bg-primary-700">
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
            </button>
        </div>
    ) : (
        <Link
            to="/chat"
            className="rounded-xl bg-secondary-100 hover:bg-secondary-50 flex justify-between items-center mb-1 px-3 py-2"
        >
            <div className="flex items-center">
                <img className="w-12 h-12 rounded-full" src={data.img} alt="profile image" />
                <div className="pl-4 flex flex-col">
                    <span className="text-secondary-600 text-lg font-semibold">{data.name}</span>
                    <span className="text-primary-600 text-sm">{data.name}</span>
                </div>
            </div>
            <span className="bg-secondary-200 rounded px-2 py-1">{data.phone}</span>
        </Link>
    );
};

export default ContactList;