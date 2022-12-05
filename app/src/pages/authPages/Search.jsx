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
    if (isLoading) {
        console.log("i am loading :D");
        contactlist = <span>Will be adding Skeleton Here Later</span>;
    }
    if (isError) {
        contactlist = <span>{error}</span>;
    }
    if (isSuccess && contacts) {
        contactlist = <ContactList contacts={contacts} add={true} />;
    }
    console.log("Search Page Rendered");
    return (
        <section>
            <Navbar path={"/"} title={"Search"} />
            <SearchBar onSearch={onSearch} />
            {contactlist}
        </section>
    );
};

const SearchBar = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState("");

    console.log("Search Bar Rendered");

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

export default Search;
