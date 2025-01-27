import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import OAuth from '../components/OAuth'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import { db } from '../firebase.config'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const {name, email, password} = formData

    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value // e.target.id will give us either id of 'email' or id of 'id'
            
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try{
            // get the auth value
            const auth = getAuth()
            
            // register the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            
            // get the acutal user info
            const user = userCredential.user

            updateProfile(auth.currentUser, {
                displayName: name
            })

            const formDataCopy = {...formData}
            // we don't want to put the password in the database
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            // update the database, add user
            await setDoc(doc(db, 'users', user.uid), formDataCopy)
            
            // redirect to home page
            navigate('/')

        } catch (error){
            toast.error('Something went wrong with registration')
        }
    }

    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'>
                        Welcome Back!
                    </p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input type="text" className='nameInput' placeholder="Name" id="name" value={name} onChange={onChange} />
                        <input type="email" className='emailInput' placeholder="Email" id="email" value={email} onChange={onChange} />

                        <div className='passwordInputDiv'>
                            <input type={showPassword ? 'text' : 'password'} 
                            className='passwordInput' placeholder="Password" 
                            id ="password" value={password} onChange={onChange}
                            />
                            
                            <img src={visibilityIcon} alt="show passwod" 
                                className='showPassword'
                                onClick={() => setShowPassword(
                                    (prevState) => !prevState)}
                            />
                        </div>

                        <Link to='forgot-password' className='forgotPasswordLink'>
                            Forgot Password
                        </Link>

                        <div className='signUpBar'>
                            <p className='signUpText'>
                                Sign Up
                            </p>
                            <button className='signUpButton'>
                                <ArrowRightIcon fill='#ffffff' width='34px'
                                    height='34px'
                                />
                            </button>
                        </div>
                    </form>

                    <OAuth />

                    <Link to='/sign-in' className='registerLink'>
                        Sign In Instead
                    </Link>
                </main>
            </div>
        </>
    )
  }
  
  export default SignUp
  