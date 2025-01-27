import {useState} from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useNavigate, Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'



function Profile() {
    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })

    const {name, email} = formData

    const navigate = useNavigate()

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }
    
    const onSubmit = async () => {
        try {
            // check if the display name is equal to the name stored in the Firestore Database
            if(auth.currentUser.displayName !== name){
                // Update display name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                // Update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            // console.log(error)
            toast.error('Could not update profile details')
        }
    }

    // update the form data state
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            // change the value dynamically using "[]"
            // using id to confirm which element to update, "name" or "email"
            [e.target.id]: e.target.value,
        }) )
    }

    return <div className='Profile'>
        <header className='profileHeader'>
            <p className='pageHeader'>My Profile</p>
            <button type="button" className='logOut' onClick={onLogout}>
                Logout
            </button>
        </header>

        <main>
            <div className='profileDetailsHeader'>
                <p className='profileDetailsText'>Personal Details</p>
                <p className='changePersonalDetails' onClick={() =>{
                    // if changDetails === true, then call onSubmit()
                    changeDetails && onSubmit()
                    // When click on the change text, change the value to the opposite, change between true and false
                    setChangeDetails((prevState) => !prevState)
                }}>
                {/* if it is true, then.. */}
                    {changeDetails ? 'done' : 'change'}
                </p>
            </div>

            <div className='profileCard'>
                <form>
                    <input type="text" id="name" 
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                            // the initial value of changeDetials is false which shows "change"
                            //  which means we cannot change the text, so when changeDetails is false
                            // disabled is true which means we are not allow to edit the form
                            disabled = {!changeDetails}
                            value={name}
                            onChange={onChange}
                            />
                    <input type="text" id="email" 
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                            // the initial value of changeDetials is false which shows "change"
                            //  which means we cannot change the text, so when changeDetails is false
                            // disabled is true which means we are not allow to edit the form
                            disabled = {!changeDetails}
                            value={email}
                            onChange={onChange}
                            />
                </form>
            </div>

            <Link to='/create-listing' className='createListing'>
                <img src={homeIcon} alt="home" />
                <p>Sell or rent your home</p>
                <img src={arrowRight} alt="arrow right" />
            </Link>
        </main>
    </div>
  }
  
  export default Profile
  