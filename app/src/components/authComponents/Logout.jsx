import { ArrowLeftOnRectangleIcon, ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";

const Logout = () => {
    const navigate = useNavigate();

    const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate("/");
    }, [isSuccess, navigate]);

    return <button disabled={isLoading} onClick={sendLogout}>{isLoading ? <ArrowPathRoundedSquareIcon className="h-6 w-6"/> : <ArrowLeftOnRectangleIcon className="h-6 w-6" />  }</button>;
};
export default Logout;
