import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../../features/auth/authApiSlice";

const Signup = () => {
    const [signup, { isLoading }] = useSignupMutation();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
    const [errMsg, setErrMsg] = useState("");

    const onSignup = async (e) => {
        e.preventDefault();
        if (password != confirmPassword) return setErrMsg("Passwords do not match");
        try {
            await signup({ phone, name, password }).unwrap();
            setPhone("");
            setName("");
            setPassword("");
            navigate("/login");
        } catch (err) {
            if (!err.originalStatus && !err.status) {
                setErrMsg("No Server Response");
            } else if (err.originalStatus === 400 || err.status === 400) {
                setErrMsg("Missing Credentials");
            } else if (err.originalStatus === 409 || err.status === 409) {
                setErrMsg("Account Already Exist");
            } else if (err.originalStatus === 429 || err.status === 429) {
                setErrMsg("Too many Requests");
            } else if (err.originalStatus === 401 || err.status === 401) {
                setErrMsg(err?.data?.message || err?.data || "Unauthorized");
            } else {
                setErrMsg(err?.data || "internal Server Error");
            }
        }
    };
    console.log(errMsg);

    return (
        <form
            className="bg-[url('./assets/bg.png')] fixed flex flex-col justify-center items-center bg-gray-100 w-full h-full"
            onSubmit={onSignup}
        >
            <span className=" font-bold pb-4 text-xl">Signup</span>
            {errMsg ? <p className=" text-red-600 my-2 py-1 px-3 rounded text-sm bg-red-100">{errMsg}</p> : null}
            <div className="flex flex-col my-2 ">
                <label className="pl-4 pb-1 text-gray-500 text-sm" htmlFor="phone">
                    Phone :
                </label>
                <input
                    className="w-60 px-4 py-2 rounded-full text-gray-700"
                    id="phone"
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="flex flex-col my-2">
                <label className="pl-4 pb-1 text-gray-500 text-sm" htmlFor="name">
                    Username :
                </label>
                <input
                    className="w-60 px-4 py-2 rounded-full text-gray-700"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="flex flex-col my-2">
                <label className="pl-4 pb-1 text-gray-500 text-sm" htmlFor="password">
                    Password :
                </label>
                <span className="relative">
                    <input
                        className="w-60 pl-4 pr-10 py-2 rounded-full text-gray-700"
                        id="password"
                        type={`${showPassword.password ? "text" : "password"}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {showPassword.password ? (
                        <EyeSlashIcon
                            onClick={() =>
                                setShowPassword((prevState) => ({
                                    ...prevState,
                                    password: !showPassword.password,
                                }))
                            }
                            className="absolute top-2 right-3 h-6 w-6 text-gray-700"
                        />
                    ) : (
                        <EyeIcon
                            onClick={() =>
                                setShowPassword((prevState) => ({
                                    ...prevState,
                                    password: !showPassword.password,
                                }))
                            }
                            className="absolute top-2 right-3 h-6 w-6 text-gray-700"
                        />
                    )}
                </span>
            </div>
            <div className="flex flex-col my-2">
                <label className="pl-4 pb-1 text-gray-500 text-sm" htmlFor="confirm-password">
                    Confirm Password :
                </label>
                <span className="relative">
                    <input
                        className="w-60 pl-4 pr-10 py-2 rounded-full text-gray-700"
                        id="confirm-password"
                        type={`${showPassword.confirmPassword ? "text" : "password"}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {showPassword.confirmPassword ? (
                        <EyeSlashIcon
                            onClick={() =>
                                setShowPassword((prevState) => ({
                                    ...prevState,
                                    confirmPassword: !showPassword.confirmPassword,
                                }))
                            }
                            className="absolute top-2 right-3 h-6 w-6 text-gray-700"
                        />
                    ) : (
                        <EyeIcon
                            onClick={() =>
                                setShowPassword((prevState) => ({
                                    ...prevState,
                                    confirmPassword: !showPassword.confirmPassword,
                                }))
                            }
                            className="absolute top-2 right-3 h-6 w-6 text-gray-700"
                        />
                    )}
                </span>
            </div>
            <button
                disabled={isLoading}
                className={`px-4 py-2 my-4 rounded-full text-white ${isLoading ? "bg-gray-300" : "bg-red-600"}`}
                type="submit"
            >
                {isLoading ? "Registering" : "Signup"}
            </button>{" "}
        </form>
    );
};

export default Signup;
