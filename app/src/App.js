import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/globalPages/Login";
import Signup from "./pages/globalPages/Signup";
import NotFound from "./pages/globalPages/NotFound";
import Home from "./pages/authPages/Home";
import Search from "./pages/authPages/Search";
import Profile from "./pages/authPages/Profile";
import Chat from "./pages/authPages/Chat";
import Group from "./pages/authPages/Group";

import Prefetch from "./features/auth/Prefetch";
import PersistUnprotected from "./features/auth/PersistUnprotected";
import PersistProtected from "./features/auth/PersistProtected";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
import ChatDetails from "./pages/authPages/ChatDetails";

function App() {
    useTitle("Mern Auth Aest");

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route element={<PersistUnprotected />}>
                    <Route index path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<PersistProtected />}>
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                        <Route element={<Prefetch />}>
                            <Route index element={<Home />} />
                            <Route path="search" element={<Search />} />
                            <Route path="profile/:id" element={<Profile />} />
                            <Route path="chat/:id" element={<Chat />} />
                            <Route path="chat-details/:id" element={<ChatDetails />} />
                            <Route path="group" element={<Group />} />
                            <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}></Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
