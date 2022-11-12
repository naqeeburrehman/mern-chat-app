import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import usePersist from "../hooks/usePersist";

const Login = () => {
    const [login, { isLoading }] = useLoginMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
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
        <form onSubmit={onLogin}>
            <p>{errMsg}</p>
            <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="persist">
                <input type="checkbox" onChange={() => setPersist((prev) => !prev)} checked={persist} />
                Trust This Device
            </label>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
