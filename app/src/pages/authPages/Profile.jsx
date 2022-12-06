import { CameraIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Navbar";
import { useState } from "react";

const Profile = () => {
    const { id, username } = useAuth();
    let { id: userId } = useParams();

    return (
        <section>
            <Navbar path={"/"} title={id ? "Profile Settings" : "Profile"} />
            {id == userId ? <EditProfileContainer user={username} /> : <ProfileContainer />}
        </section>
    );
};

const ProfileContainer = () => {
    return (
        <div className="bg-secondary-100 rounded-xl mx-10 py-10 flex flex-col justify-center items-center my-12">
            <div className="w-32 h-32 border overflow-hidden flex justify-center items-center rounded-full">
                <img
                    className="w-fit"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTewPdubiwZ-wA40RGuCnUu-IBIkj3iSCGGd6s5Hf7Q&s"
                    alt="Profile Image"
                />
            </div>
            <div className="flex flex-col m-4 p-2 justify-center items-center">
                <span className="font-semibold text-lg text-secondary-700">Naqeeb Ur Rehman</span>
                <span className="text-secondary-500">+92 306 0595818</span>
            </div>
            <Link
                className="flex justify-center items-center px-4 py-2 my-4 rounded text-white bg-primary-600 hover:bg-primary-500"
                type="submit"
            >
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                Message
            </Link>
        </div>
    );
};

const EditProfileContainer = ({ user }) => {
    const [errMsg, setErrMsg] = useState("");
    const [name, setName] = useState(user);

    return (
        <div className="bg-secondary-100 rounded-xl mx-10 py-10 flex flex-col justify-center items-center my-12">
            <div className="z-10 relative">
                <div className="w-32 h-32 border flex justify-center items-center overflow-hidden rounded-full">
                    <img
                        className="w-fit"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTewPdubiwZ-wA40RGuCnUu-IBIkj3iSCGGd6s5Hf7Q&s"
                        alt="Profile Image"
                    />
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full text-secondary-100 bg-primary-600 hover:bg-primary-500">
                    <input className="absolute cursor-pointer rounded-full opacity-0 w-10 h-10" type="file" />
                    <CameraIcon className="m-2 w-6 h-6" />
                </div>
            </div>
            <form className="flex flex-col justify-center items-center bg-secondary-100 w-full h-full">
                {errMsg ? (
                    <p className=" text-primary-600  my-2 py-1 px-3 rounded text-sm bg-primary-100">{errMsg}</p>
                ) : null}
                <div className="flex flex-col my-2">
                    <label className="pl-4 pb-1 text-secondary-500 text-sm" htmlFor="name">
                        Username :
                    </label>
                    <input
                        className="w-60 px-4 py-2 rounded text-secondary-700"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <Link
                    className="flex justify-center items-center px-4 py-2 my-4 rounded text-white bg-primary-600 hover:bg-primary-500"
                    type="submit"
                >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Save Profile
                </Link>
            </form>
        </div>
    );
};
export default Profile;
