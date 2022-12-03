import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApiSlice";
import { selectCurrentToken, setCredentials } from "../../features/auth/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import usePersist from "../../hooks/usePersist";

const Login = () => {
    const [login, { isLoading }] = useLoginMutation();

    const token = useSelector(selectCurrentToken);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            navigate("/", { replace: true });
        }
    }, [token]);

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [persist, setPersist] = usePersist();

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ phone, password }).unwrap();
            dispatch(setCredentials({ accessToken }));
            setPhone("");
            setPassword("");
            navigate("/profile");
        } catch (err) {
            if (!err.originalStatus && !err.status) {
                setErrMsg("No Server Response");
            } else if (err.originalStatus === 400 || err.status === 400) {
                setErrMsg("Missing Phone or Password");
            } else if (err.originalStatus === 429 || err.status === 429) {
                setErrMsg("Too many Requests");
            } else if (err.originalStatus === 401 || err.status === 401) {
                setErrMsg(err?.data?.message || err?.data || "Unauthorized");
            } else {
                setErrMsg(err?.data || "internal Server Error");
            }
        }
    };

    return (
        <form
            className="bg-[url('./assets/bg.png')] fixed flex flex-col justify-center items-center bg-secondary-100 w-full h-full"
            onSubmit={onLogin}
        >
            <span className=" font-bold pb-4 text-xl">Login</span>
            {errMsg ? (
                <p className=" text-primary-600  my-2 py-1 px-3 rounded text-sm bg-primary-100">{errMsg}</p>
            ) : null}
            <div className="flex flex-col my-2 ">
                <label className="pl-4 pb-1 text-secondary-500 text-sm" htmlFor="phone">
                    Phone :
                </label>
                <input
                    className="w-60 px-4 py-2 rounded text-secondary-700"
                    id="phone"
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="flex flex-col my-2">
                <label className="pl-4 pb-1 text-secondary-500 text-sm" htmlFor="password">
                    Password :
                </label>
                <span className="relative">
                    <input
                        className="w-60 pl-4 pr-10 py-2 rounded text-secondary-700"
                        id="password"
                        type={`${showPassword ? "text" : "password"}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {showPassword ? (
                        <EyeSlashIcon
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-2 right-3 h-6 w-6 text-secondary-700"
                        />
                    ) : (
                        <EyeIcon
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-2 right-3 h-6 w-6 text-secondary-700"
                        />
                    )}
                </span>
            </div>
            <div className="my-2">
                <input type="checkbox" id="persist" onChange={() => setPersist((prev) => !prev)} checked={persist} />
                <label className="pl-2 text-secondary-500 text-sm" htmlFor="persist">
                    Keep me logged in
                </label>
            </div>
            <button
                disabled={isLoading}
                className={`px-4 py-2 my-2 rounded text-white ${
                    isLoading ? "bg-secondary-400" : "bg-primary-600 hover:bg-primary-500"
                }`}
                type="submit"
            >
                {isLoading ? "Authenticating" : "Login"}
            </button>
        </form>
    );
};

export default Login;
