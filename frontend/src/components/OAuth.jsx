import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth";
import {app} from "../firebase.config";
import {Button} from "flowbite-react";
import {AiFillGoogleCircle} from "react-icons/ai";
import { toast } from 'react-toastify';

// import { setCredentials } from '../slices/authSlice';
import {useGoogleMutation} from "../slices/userApiSlice";
import {setCredentials} from "../slices/authSlice";

const OAuth = () => {
    const auth = getAuth(app);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [google, {isLoading}] = useGoogleMutation();

    const HandleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: "select_account"});
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            const res = await google({ name: resultFromGoogle.user.displayName, email: resultFromGoogle.user.email, googlePhotoUrl: resultFromGoogle.user.photoURL}).unwrap();
            dispatch(setCredentials({...res}));
            navigate('/');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };


    return (
        <Button 
        onClick={HandleGoogleClick}
        type="button" 
        gradientDuoTone="pinkToOrange" 
        outline 
        className="mb-2"
        disabled={isLoading}
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2"/> Google
        </Button>
    );
};

export default OAuth;
