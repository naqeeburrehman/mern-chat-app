import { ExclamationCircleIcon, UserMinusIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { useGetSearchsQuery } from "../../features/search/searchApiSlice";

const Group = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const onAddUser = (user) => {
        let userExists = false;
        selectedUsers.map((selectedUser) => {
            if (selectedUser._id == user._id) userExists = true;
        });
        if (userExists) toast.error(`user already added`);
        else setSelectedUsers((prevState) => [...prevState, user]);
    };
    const onRemoveUser = (user) => {
        setSelectedUsers(selectedUsers.filter((item) => item._id !== user._id));
    };
    console.log("main component rendered");
    return (
        <section>
            <Navbar path={"/"} title={"Create Group"} />
            <Search onAddUser={onAddUser} />
            <SelectedUsersList selectedUsers={selectedUsers} onRemoveUser={onRemoveUser} />
            <GroupForm selectedUsers={selectedUsers} />
        </section>
    );
};

const SelectedUsersList = ({ selectedUsers, onRemoveUser }) => {
    console.log("selected users list rendered");
    return (
        <div className="border-2 border-dashed border-secondary-300 h-40 overflow-scroll rounded-2xl m-2 p-1 flex flex-wrap">
            {selectedUsers.map((user) => (
                <div key={user._id} className="w-1/2 sm:w-1/3 md:w-3/12 lg:w-1/5 p-1">
                    <div className="rounded-xl py-1 px-2 sm:px-3 sm:py-2 flex justify-between bg-secondary-100 items-center">
                        <div className="flex items-center">
                            <div className="flex flex-col">
                                <span className="text-ellipsis overflow-hidden whitespace-nowrap w-20 sm:w-20 md:w-24 xl:w-40 text-secondary-600 text-lg font-semibold">
                                    {user.name}
                                </span>
                                <span className="text-primary-600 text-sm">{user.phone}</span>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <button
                                type="button"
                                onClick={() => onRemoveUser(user)}
                                className="bg-primary-600 hover:bg-primary-500 text-secondary-100 rounded p-2 "
                            >
                                <UserMinusIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const GroupForm = () => {
    const [newGroupName, setNewGroupName] = useState("");
    let isLoading = false;
    const createGroup = () => {
        setTimeout(() => {
            isLoading = false;
        }, 3000);
        isLoading = true;
        setNewGroupName("");
    };
    console.log("form rendered");
    return (
        <div className="flex justify-evenly items-center bg-secondary-100 w-full h-full">
            <div className="flex flex-col my-2 ">
                <input
                    placeholder="Group Name"
                    className="w-60 px-4 py-2 rounded text-secondary-700"
                    id="chatname"
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                />
            </div>
            <button
                onClick={createGroup}
                disabled={isLoading}
                className={`px-4 py-2 my-4 rounded text-white ${
                    isLoading ? "bg-secondary-400" : "bg-primary-600 hover:bg-primary-500"
                }`}
            >
                {isLoading ? "Creating" : "Create"}
            </button>
        </div>
    );
};

const Search = ({ onAddUser }) => {
    const [skip, setSkip] = useState(true);
    const [searchQuery, setSearchQuery] = useState({ u: "", q: 24 });
    const {
        data: contacts,
        isFetching,
        isSuccess,
        isError,
        error,
    } = useGetSearchsQuery(
        { u: searchQuery.u, q: searchQuery.q },
        {
            skip,
            refetchOnMountOrArgChange: true,
        }
    );
    const onSearch = (e, searchValue) => {
        e.preventDefault();
        if (searchValue) {
            setSearchQuery({ u: searchValue });
            setSkip(false);
        }
    };
    let contactlist;
    if (isError) {
        contactlist = <IfNotSuccess message={error} />;
    }
    if (isSuccess && contacts) {
        if (contacts.ids.length > 0) {
            const { entities } = contacts;
            let contactCards = [];
            Object.keys(entities).forEach((key, index) => {
                contactCards.push(
                    <div key={entities[key]._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-3/12 p-1">
                        <div className="rounded-xl px-3 py-2 flex justify-between bg-secondary-100 items-center">
                            <div className="flex items-center">
                                <img className="w-12 h-12 rounded-full" src={entities[key].img} alt="profile image" />
                                <div className="pl-4 flex flex-col">
                                    <span className="text-ellipsis overflow-hidden whitespace-nowrap sm:w-40 md:w-28 xl:w-40 text-secondary-600 text-lg font-semibold">
                                        {entities[key].name}
                                    </span>
                                    <span className="text-primary-600 text-sm">{entities[key].phone}</span>
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                <button
                                    type="button"
                                    onClick={() => onAddUser(entities[key])}
                                    className="bg-primary-600 hover:bg-primary-500 text-secondary-100 rounded p-2 "
                                >
                                    <UserPlusIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            });
            contactlist = <div className="h-40 overflow-scroll px-1 py-2 flex flex-wrap">{contactCards}</div>;
        } else contactlist = <IfNotSuccess message={"No Contacts Found"} />;
    }
    if (isFetching) {
        contactlist = <Skeleton />;
    }
    return (
        <>
            <SearchBar onSearch={onSearch} />
            {contactlist}
        </>
    );
};

const SearchBar = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState("");
    return (
        <form
            onSubmit={(e) => {
                onSearch(e, searchValue);
                setSearchValue("");
            }}
            className="flex bg-secondary-100 text-secondary-100 p-2"
        >
            <input
                className="text-secondary-700 bg-secondary-300 focus:bg-secondary-200 hover:bg-secondary-200 w-full mr-1 px-4 py-2 rounded"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="p-2 bg-primary-600 rounded hover:bg-primary-500" type="submit">
                <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
        </form>
    );
};

const IfNotSuccess = ({ message }) => {
    return (
        <div className="pt-24 md:pt-40 flex flex-col justify-center items-center">
            <ExclamationCircleIcon className="w-40 h-40 text-secondary-200" />
            <span className="pt-10 text-secondary-600 font-semibold text-xl">{message}</span>
        </div>
    );
};

const Skeleton = () => {
    return (
        <div
            role="status"
            className="p-4 space-y-4 rounded border border-secondary-200 divide-y divide-secondary-200 shadow animate-pulse "
        >
            <div className="flex justify-between items-center">
                <div>
                    <div className="h-2.5 bg-secondary-300 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-secondary-200 rounded-full"></div>
                </div>
                <div className="h-2.5 bg-secondary-300 rounded-full w-12"></div>
            </div>
            <div className="flex justify-between items-center pt-4">
                <div>
                    <div className="h-2.5 bg-secondary-300 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-secondary-200 rounded-full"></div>
                </div>
                <div className="h-2.5 bg-secondary-300 rounded-full w-12"></div>
            </div>
            <div className="flex justify-between items-center pt-4">
                <div>
                    <div className="h-2.5 bg-secondary-300 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-secondary-200 rounded-full"></div>
                </div>
                <div className="h-2.5 bg-secondary-300 rounded-full w-12"></div>
            </div>
            <div className="flex justify-between items-center pt-4">
                <div>
                    <div className="h-2.5 bg-secondary-300 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-secondary-200 rounded-full"></div>
                </div>
                <div className="h-2.5 bg-secondary-300 rounded-full w-12"></div>
            </div>
            <div className="flex justify-between items-center pt-4">
                <div>
                    <div className="h-2.5 bg-secondary-300 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-secondary-200 rounded-full"></div>
                </div>
                <div className="h-2.5 bg-secondary-300 rounded-full w-12"></div>
            </div>
        </div>
    );
};

export default Group;
