import { Routes, Route } from "react-router-dom";
import Layout from "./components/globalComponents/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Prefetch from "./features/auth/Prefetch";
import PersistUnprotected from "./features/auth/PersistUnprotected";
import PersistProtected from "./features/auth/PersistProtected";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
import Signup from "./pages/Signup";

function App() {
    useTitle("Mern Auth Aest");

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route element={<PersistUnprotected />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<PersistProtected />}>
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                        <Route element={<Prefetch />}>
                            <Route path="profile" element={<Profile />} />
                            <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}></Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
