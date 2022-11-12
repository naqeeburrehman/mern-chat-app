import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import Logout from "../authComponents/useLogout";
const Navbar = () => {
    const token = useSelector(selectCurrentToken);

    return (
        <nav>
            <Link to="/">
                <button>Home</button>
            </Link>
            {token ? (
                <>
                    <Link to="/chat">
                        <button>Chat</button>
                    </Link>
                    <Link to="/profile">
                        <button>Profile</button>
                    </Link>
                    <Link>
                        <Logout />
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                    <Link to="/signup">
                        <button>Signup</button>
                    </Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
