import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ContactList from "../../components/ContactList";
import Navbar from "../../components/Navbar";
import { useGetChatsQuery } from "../../features/chat/chatApiSlice";

const Home = () => {
    const {
        data: contacts,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetChatsQuery(
        { u: " ", q: 120 },
        {
            refetchOnMountOrArgChange: true,
        }
    );
    let contactlist;
    if (isError) {
        contactlist = <IfNotSuccess message={error} />;
    }
    if (isSuccess && contacts) {
        if (contacts.ids.length > 0) contactlist = <ContactList contacts={contacts} />;
        else contactlist = <IfNotSuccess message={"No Contacts Found"} />;
    }
    if (isLoading) {
        contactlist = <Skeleton />;
    }
    return (
        <section>
            <Navbar icon={<MagnifyingGlassIcon />} path={"/search"} title={"Home"} />
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

export default Home;
