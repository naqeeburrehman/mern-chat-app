import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Group = () => {
  const navigate = useNavigate()
  console.log(navigate(-1))
    return (
        <section>
            <Navbar path={"/"} title={"group"} />
            <div>Group</div>
        </section>
    );
};

export default Group;
