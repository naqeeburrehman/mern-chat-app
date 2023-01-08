import { ExclamationCircleIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useGetChatsQuery } from "../../features/chat/chatApiSlice";
import useAuth from "../../hooks/useAuth";

const ChatDetails = () => {
    const params = useParams();
    const { id } = useAuth();

    const { chat } = useGetChatsQuery("chatsList", {
        selectFromResult: ({ data }) => ({
            chat: data?.entities[params.id],
        }),
    });

    let content;

    if (chat) {
        content = chat?.isGroupChat ? <GroupDetails data={chat} /> : <UserDetails data={chat} />;
    } else
        content = (
            <div className="pt-24 md:pt-40 flex flex-col justify-center items-center">
                <ExclamationCircleIcon className="w-40 h-40 text-secondary-200" />
                <span className="pt-10 text-secondary-600 font-semibold text-xl">Loading...</span>
            </div>
        );
    return (
        <section>
            <Navbar path={`/chat/${params.id}`} title={"Chat"} titleLink={`/chat/${params.id}`} />
            {content}
        </section>
    );
};

const GroupDetails = ({ data }) => {
    const { id } = useAuth();

    const users = data.users.map((user) => {
        return (
            <div key={user._id} className="w-full min-[400px]:w-1/2 sm:w-1/3 md:w-3/12 lg:w-1/5 2xl:w-1/6 p-1">
                <div className="rounded-xl py-1 px-2 sm:px-3 sm:py-2 flex justify-between bg-secondary-100 items-center">
                    <div className="flex items-center">
                        <img className="w-12 h-12 mr-2 my-2 rounded-full" src={user.img} alt="profile image" />
                        <div className="flex flex-col">
                            <span className="text-ellipsis overflow-hidden whitespace-nowrap w-20 sm:w-20 md:w-16 lg:w-20 xl:w-38 2xl:w-40 text-secondary-600 text-lg font-semibold">
                                {user._id === id ? "you" : user.name}
                            </span>
                            <span className="text-primary-600 text-sm">
                                {user.phone}
                                {user._id === data.groupAdmin?._id ? "(admin)" : null}
                            </span>
                        </div>
                    </div>
                    {user._id !== id && data.groupAdmin?._id === id ? (
                        <div className="flex justify-center items-center">
                            <button
                                type="button"
                                // onClick={() => onRemoveUser(user)}
                                className="bg-primary-600 hover:bg-primary-500 text-secondary-100 rounded p-2 "
                            >
                                <UserMinusIcon className="w-6 h-6" />
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    });

    return (
        <div>
            <span>Group Details</span>
            <div className="max-h-60 overflow-scroll rounded-2xl m-2 p-1 flex flex-wrap">{users}</div>
        </div>
    );
};

const UserDetails = ({ data }) => {
    const { id } = useAuth();

    let user;
    data.users.map((foundUser) => {
        if (foundUser._id !== id) user = foundUser;
        else return;
    });

    return (
        <div className="rounded-xl bg-secondary-100 hover:bg-secondary-50 flex mb-1">
            <Link to={"/profile/" + user._id}>
                <img className="w-12 h-12 mx-3 my-2 rounded-full" src={user.img} alt="profile image" />
            </Link>
            <Link to={`/profile/${user._id}`} className="w-full flex justify-between items-center px-3 py-2">
                <div className="flex items-center">
                    <div className="pl-4 flex flex-col">
                        <span className="text-secondary-600 text-lg font-semibold">{user.name}</span>
                        <span className="text-primary-600 text-sm">{user.phone}</span>
                    </div>
                </div>
                <span className="bg-secondary-200 rounded text-sm px-2 py-1">{user.phone}</span>
            </Link>
        </div>
    );
};

export default ChatDetails;
