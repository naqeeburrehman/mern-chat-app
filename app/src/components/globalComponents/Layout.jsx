import { Outlet } from "react-router-dom";
import Navbar from './Navbar'

const Layout = () => {
    return (
        <main className="">
            <Navbar className="fixed"/>
            <Outlet />
        </main>
    );
};
export default Layout;
