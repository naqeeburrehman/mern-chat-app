import { ChatBubbleLeftEllipsisIcon, ExclamationCircleIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useGetChatsQuery } from "../../features/chat/chatApiSlice";
import useAuth from "../../hooks/useAuth";

const Details = () => {
    const params = useParams();
    const { id } = useAuth();

    const { chat } = useGetChatsQuery("chatsList", {
        selectFromResult: ({ data }) => ({
            chat: data?.entities[params.id],
        }),
    });

    let content;

    if (chat) content = chat?.groupAdmin?._id === id ? <EditGroup /> : <GroupDetails data={chat} />;
    else
        content = (
            <div className="pt-24 md:pt-40 flex flex-col justify-center items-center">
                <ExclamationCircleIcon className="w-40 h-40 text-secondary-200" />
                <span className="pt-10 text-secondary-600 font-semibold text-xl">Loading...</span>
            </div>
        );
    return (
        <section>
            <Navbar path={`/chat/${params.id}`} title={"Chat Details"} />
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
                            <span className="text-primary-600 text-sm">{user.phone}</span>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            type="button"
                            // onClick={() => onRemoveUser(user)}
                            className="bg-primary-600 hover:bg-primary-500 text-secondary-100 rounded p-2 "
                        >
                            <UserMinusIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div>
            <span>Group Details</span>
            <div className="max-h-60 overflow-scroll rounded-2xl m-2 p-1 flex flex-wrap">
                {users}
                {users}
                {users}
            </div>
        </div>
    );
};

const EditGroup = () => {
    return <div>Edit Group</div>;
};

export default Details;
