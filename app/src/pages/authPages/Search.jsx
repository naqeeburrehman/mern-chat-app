import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ContactList from "../../components/ContactList";
import Navbar from "../../components/Navbar";
import { useGetSearchsQuery, useSearchPostMutation } from "../../features/search/searchApiSlice";

const Search = () => {
    // const {
    //     data: contacts,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error,
    // } = useGetSearchsQuery(
    //     { u: "", q: 10 },
    //     {
    //         skip:false,
    //         pollingInterval: 120 * 1000, // in every 2 minutes
    //         refetchOnFocus: true,
    //         refetchOnMountOrArgChange: true,
    //     }
    // );

    let contactlist;
    // if (isLoading) contactlist = <span>Will be adding Skeleton Here Later</span>;
    // if (isSuccess && contacts) contactlist = <ContactList contacts={contacts} add={true} />;

    console.log("Search Page Rendered");
    return (
        <section>
            <Navbar path={"/"} title={"Search"} />
            <SearchBar />
            {/* {contactlist} */}
            <ContactList />
        </section>
    );
};

const SearchBar = () => {
    const [searchValue, setSearchValue] = useState("");
    const [skip, setSkip] = useState(true);
    const [getData, { isLoading }] = useSearchPostMutation();


    // const {
    //     data: contacts,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error,
    // } = useGetSearchsQuery(
    //     { u: "321", q: 10 },
    //     {
    //         skip,
    //         pollingInterval: 120 * 1000, // in every 2 minutes
    //         refetchOnFocus: true,
    //         refetchOnMountOrArgChange: true,
    //     }
    // );
    // console.log(contacts);

    console.log("Search Bar Rendered");

    const onSearch = (e) => {
        e.preventDefault();
        setSkip(!skip);
        getData()
    };

    return (
        <form onSubmit={onSearch} className="flex bg-secondary-100 text-secondary-100 p-2">
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
