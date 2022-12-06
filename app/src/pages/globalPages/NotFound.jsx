import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    let navigate = useNavigate();
    return (
        <div className="pt-24 md:pt-40 flex flex-col justify-center items-center">
            <QuestionMarkCircleIcon className="w-40 h-40 text-secondary-200" />
            <span className="pt-10 text-secondary-600 font-semibold text-xl">404 Not Found </span>
            <button
                onClick={() => navigate(-1, { replace: true })}
                className="flex justify-center items-center px-4 py-2 mt-16 rounded text-white bg-primary-600 hover:bg-primary-500"
                to="/login"
            >
                Go Back
            </button>
        </div>
    );
};

export default NotFound;
