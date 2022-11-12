import { Outlet } from "react-router-dom";
import Navbar from '../globalComponents/Navbar'

const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};
export default Layout;
