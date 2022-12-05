import Navbar from "../../components/Navbar";

const Profile = () => {
    return (
        <section>
            <Navbar path={"/"} title={"Profile"} />
            <ProfileContainer />
        </section>
    );
};

const ProfileContainer = () => {
    return (
        <div>
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTewPdubiwZ-wA40RGuCnUu-IBIkj3iSCGGd6s5Hf7Q&s"
                alt="Profile Image"
            />
            <span>name</span>
            <span>phone</span>
            <span>password</span>
        </div>
    );
};

export default Profile;
