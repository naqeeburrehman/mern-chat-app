import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Details = () => {
    const { id } = useParams();

    return (
        <section>
            <Navbar path={`/chat/${id}`} title={"Chat Details"} />
            <GroupDetails />
        </section>
    );
};

const GroupDetails = () => {
    return <div>Group Details</div>;
};

const ChatDetails = () => {
    return <div>Chat Details</div>;
};

export default Details;
