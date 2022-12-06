import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ContactList from "../../components/ContactList";
import Navbar from "../../components/Navbar";

const Home = () => {
    const contacts = {ids:[1,2,3,4,5],entities:[
        {
            _id: 1,
            phone: "0360595818",
            name: "naqeeb",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTux6W-JOnzu6w_aZW0TO1OqEqexEaBOtQ9sgWDDZlJUsz0Lso&s",
        },
        {
            _id: 2,
            phone: "0360595818",
            name: "naqeeb",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTux6W-JOnzu6w_aZW0TO1OqEqexEaBOtQ9sgWDDZlJUsz0Lso&s",
        },
        {
            _id: 3,
            phone: "0360595818",
            name: "naqeeb",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTux6W-JOnzu6w_aZW0TO1OqEqexEaBOtQ9sgWDDZlJUsz0Lso&s",
        },
        {
            _id: 4,
            phone: "0360595818",
            name: "naqeeb",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTux6W-JOnzu6w_aZW0TO1OqEqexEaBOtQ9sgWDDZlJUsz0Lso&s",
        },
        {
            _id: 5,
            phone: "0360595818",
            name: "naqeeb",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTux6W-JOnzu6w_aZW0TO1OqEqexEaBOtQ9sgWDDZlJUsz0Lso&s",
        },
    ]};

    return (
        <section>
            <Navbar icon={<MagnifyingGlassIcon />} path={"/search"} title={"Home"} />
            <ContactList contacts={contacts} />
        </section>
    );
};

export default Home;
