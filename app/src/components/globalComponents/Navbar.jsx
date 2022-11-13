import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../features/auth/authSlice";
import { NavLink } from "react-router-dom";
import Logout from "../authComponents/Logout";
import {
    ArrowRightOnRectangleIcon,
    ChatBubbleBottomCenterTextIcon,
    HomeIcon,
    UserCircleIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
const Navbar = () => {
    const token = useSelector(selectCurrentToken);

    return (
        <nav className="bg-red-600 text-white  flex justify-evenly">
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
        </nav>
    );
};

export default Navbar;
