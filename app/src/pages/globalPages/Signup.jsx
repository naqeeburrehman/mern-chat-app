import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../../features/auth/authApiSlice";

const Signup = () => {
    const [signup, { isLoading }] = useSignupMutation();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const onSignup = async (e) => {
        e.preventDefault();
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
        <form onSubmit={onSignup}>
            <p>{errMsg}</p>
            <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={isLoading} type="submit">
                Signup
            </button>
        </form>
    );
};

export default Signup;
