import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";

const Logout = () => {
    const navigate = useNavigate();

    const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();

    let content;

    useEffect(() => {
        if (isSuccess) navigate("/");
    }, [isSuccess, navigate]);
    
    if(isLoading){
        content = <button>Logging out</button> 
    }

    content = <button onClick={sendLogout}>Logout</button>

    return content;
};
export default Logout;
