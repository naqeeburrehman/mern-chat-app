import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ContactList from "../../components/ContactList";
import Navbar from "../../components/Navbar";

const Search = () => {
    const contacts = [
        {
            id: 1,
            phone: "0360595818",
            name: "naqeeb",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTux6W-JOnzu6w_aZW0TO1OqEqexEaBOtQ9sgWDDZlJUsz0Lso&s",
        },
    ];

    return (
        <section>
            <Navbar path={"/"} title={"Search"} />
            <SearchBar />
            <ContactList contacts={contacts} add={true} />
        </section>
    );
};

const SearchBar = () => {
    const [searchValue, setSearchValue] = useState("");

    return (
        <form className="flex bg-secondary-200 text-secondary-100 p-2 pb-1">
            <input
                className=" bg-primary-800 focus:bg-primary-600 hover:bg-primary-700 w-full mr-1 px-4 py-2 rounded"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="p-2 bg-primary-800 rounded hover:bg-primary-600" type="submit">
                <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
        </form>
    );
};

export default Search;
