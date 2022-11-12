import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { ROLES } from "../config/roles";
const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isManager = false;
    let isAdmin = false;
    let status = "User";

    if (token) {
        const decoded = jwtDecode(token);
        const { username, id, roles } = decoded.UserInfo;
        isManager = roles.includes(ROLES.Manager);
        isAdmin = roles.includes(ROLES.Admin);
        
        if (isManager) status = "Manager";
        if (isAdmin) status = "Admin";

        return { username, id, roles, status, isManager, isAdmin };
    }

    return { username: "", id: null, roles: [], isManager, isAdmin, status };
};
export default useAuth;
