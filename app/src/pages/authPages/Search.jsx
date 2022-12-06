import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ContactList from "../../components/ContactList";
import Navbar from "../../components/Navbar";
import { useGetSearchsQuery } from "../../features/search/searchApiSlice";

const Search = () => {
    const [skip, setSkip] = useState(true);
    const [searchQuery, setSearchQuery] = useState({ u: "", q: 24 });
    const {
        data: contacts,
        isLoading,
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
        if (contacts.ids.length > 0) contactlist = <ContactList contacts={contacts} add={true} />;
        else contactlist = <IfNotSuccess message={"No Contacts Found"} />;
    }
    if (isFetching) {
        contactlist = <Skeleton />;
    }
    return (
        <section>
            <Navbar path={"/"} title={"Search"} />
            <SearchBar onSearch={onSearch} />
            {contactlist}
        </section>
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

export default Search;
