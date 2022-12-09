import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ContactList from "../../components/ContactList";
import Navbar from "../../components/Navbar";

const Home = () => {
    return (
        <section>
            <Navbar icon={<MagnifyingGlassIcon />} path={"/search"} title={"Home"} />
            <ContactList />
        </section>
    );
};

export default Home;
