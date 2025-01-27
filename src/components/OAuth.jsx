import { useLocation, useNavigate } from "react-router-dom"
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()
    const onGoogleClick = async () =>{
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            // get user from the Google sign in
            const user = result.user

            
            // Check for user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            
            // if user doesn't exist, create user
            if(!docSnap.exists()){
                // the parameter in doc() means: doc(database, collections, user uid)
                // setDoc has two parameters, doc() and object{}
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                }) 
            }
            // Once done, navigate to home page
            navigate('/')
        } catch (error) {
            toast.error('Could not authorize with Google')
        }
    }

    return (
        <div className="socialLogin">
            <p>Sign {location.pathname == '/sign-up' ? 'up' : 'in'} with </p>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img className='socialIconImg' src={googleIcon} alt="google"/>
            </button>
        </div>
    )
}

export default OAuth
