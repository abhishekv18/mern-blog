import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import {GoogleAuthProvider, signInWithPopup, getAuth} from "@firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router";
export default function OAuth() {
    const auth = getAuth(app);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleGoogleClick=async()=>{
        const provider=new GoogleAuthProvider();
        
       provider.setCustomParameters({prompt:'select_account'})
        try {
          
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          photo: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      if(res.ok){
      dispatch(signInSuccess(data));
      }
      navigate('/');
    //  console.log(result);
        } catch (error) {
            console.log("could not login with the google",error);
        }
    }
  return (
   <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
    <AiFillGoogleCircle className="w-6 h-6 mr-2"/>
    Continue with Google</Button>
  )
}
