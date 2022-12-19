import { ArrowLeftIcon, Bars3Icon, PowerIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
const Navbar = ({ path, title, icon }) => {
    const { id } = useAuth();
    const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);

    useEffect(() => {
        if (isSuccess) navigate("/login");
    }, [isSuccess, navigate]);

    return (
        <div>
            {menu ? (
                <div onClick={() => setMenu(!menu)} className="fixed w-screen h-screen bg-secondary-900 opacity-80" />
            ) : null}
            <nav className="fixed w-full flex justify-between items-center bg-primary-700 text-secondary-100 p-4 z-50">
                <Link className="p-1 rounded hover:bg-primary-600 " to={path}>
                    <button className="block w-6 h-6">{icon ? icon : <ArrowLeftIcon />}</button>
                </Link>
                <span className="">{title}</span>
                <div className="relative">
                    <div onClick={() => setMenu(!menu)} className="cursor-pointer p-1 rounded hover:bg-primary-600">
                        {menu ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </div>
                    <div
                        className={`${
                            menu ? "flex" : "hidden"
                        } flex-col rounded absolute -right-2 top-0 w-40 mt-14 p-2 bg-primary-600`}
                    >
                        <Link
                            onClick={() => setMenu(!menu)}
                            to={`/new-group`}
                            className="flex items-center pl-4 px-2 py-1 m-1 rounded hover:bg-primary-500"
                        >
                            <UserGroupIcon className="mr-1 w-5 h-5" />
                            <span>New Group</span>
                        </Link>
                        <Link
                            onClick={() => setMenu(!menu)}
                            to={`/profile/${id}`}
                            className="flex items-center pl-4 px-2 py-1 m-1 rounded hover:bg-primary-500"
                        >
                            <UserIcon className="mr-1 w-5 h-5" />
                            <span>Profile</span>
                        </Link>
                        <span className="w-10/12 m-auto border border-primary-500" />
                        <button
                            disabled={isLoading}
                            onClick={sendLogout}
                            to="/logout"
                            className="flex  items-center pl-4 px-2 py-1 m-1 rounded hover:bg-primary-500"
                        >
                            <PowerIcon className="mr-1 w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>
            <div className="h-16" />
        </div>
    );
};

export default Navbar;

{
    /* <nav className="bg-red-600 text-white  flex justify-evenly">
<NavLink
    className={({ isActive }) =>
        (isActive ? "bg-red-800" : null) + " py-4 flex-1 flex justify-center items-center"
    }
    to="/"
>
    <button>
        <HomeIcon className="w-6 h-6" />{" "}
    </button>
</NavLink>
{token ? (
    <>
        <NavLink
            className={({ isActive }) =>
                (isActive ? "bg-red-800" : null) + " py-4 flex-1 flex justify-center items-center"
            }
            to="/chat"
        >
            <button>
                <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />{" "}
            </button>
        </NavLink>
        <NavLink
            className={({ isActive }) =>
                (isActive ? "bg-red-800" : null) + " py-4 flex-1 flex justify-center items-center"
            }
            to="/profile"
        >
            <button>
                <UserCircleIcon className="h-6 w-6" />{" "}
            </button>
        </NavLink>
        <NavLink className="py-4 flex-1 flex justify-center items-center">
            <Logout />
        </NavLink>
    </>
) : (
    <>
        <NavLink
            className={({ isActive }) =>
                (isActive ? "bg-red-800" : null) + " py-4 flex-1 flex justify-center items-center"
            }
            to="/login"
        >
            <button>
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </button>
        </NavLink>
        <NavLink
            className={({ isActive }) =>
                (isActive ? "bg-red-800" : null) + " py-4 flex-1 flex justify-center items-center"
            }
            to="/signup"
        >
            <button>
                <UserPlusIcon className="w-6 h-6" />
            </button>
        </NavLink>
    </>
)}
</nav> */
}
