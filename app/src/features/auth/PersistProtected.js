import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation();

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== "development") {
            // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                console.log("verifying refresh token");
                try {
                    //const response =
                    await refresh();
                    //const { accessToken } = response.data
                    setTrueSuccess(true);
                } catch (err) {
                    console.error(err);
                }
            };

            if (!token && persist) verifyRefreshToken();
        }

        return () => (effectRan.current = true);

        // eslint-disable-next-line
    }, []);

    let content;
    if (!persist) {
        // persist: no
        console.log("no persist");
        content = <Outlet />;
    } else if (isLoading) {
        //persist: yes, token: no
        console.log("loading");
        content = <RenderLoading />;
    } else if (isError) {
        //persist: yes, token: no
        console.log("error");
        content = <RenderReLogin error={error} />;
    } else if (isSuccess && trueSuccess) {
        //persist: yes, token: yes
        console.log("success");
        content = <Outlet />;
    } else if (token && isUninitialized) {
        //persist: yes, token: yes
        console.log("token and uninit");
        console.log(isUninitialized);
        content = <Outlet />;
    }

    return content;
};

const RenderReLogin = ({ error }) => {
    return (
        <div className="pt-32 md:pt-52 flex flex-col justify-center items-center">
            <ExclamationTriangleIcon className="w-40 h-40 text-secondary-200" />
            <span className="pt-10 text-secondary-600 font-semibold text-xl">{error?.data?.message} </span>
            <Link
                className="flex justify-center items-center px-4 py-2 mt-16 rounded text-white bg-primary-600 hover:bg-primary-500"
                to="/login"
            >
                Please Login
            </Link>
        </div>
    );
};

const RenderLoading = () => {
    return (
        <div className="pt-32 md:pt-52 flex flex-col justify-center items-center">
            <ArrowPathIcon className="w-40 h-40 text-secondary-200" />
            <span className="pt-10 text-secondary-600 font-semibold text-xl">Loading please Wait</span>
        </div>
    );
};

export default PersistLogin;
