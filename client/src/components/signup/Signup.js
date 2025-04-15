import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../reducers/authReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { useLoginMutation, useSignupMutation } from '../../reducers/api/authApiSlice'
import Logo from '../logo/Logo'
import Illustration from '../../icons/signup/signup-illustration.png'
import ChoiceButton from '../button/ChoiceButton'
import SignupForm from './SignupForm'
import styles from '../../styles/Signup-styles/Signup.module.css'
import { saveProfilePictureToDB } from '../../reducers/thunk/authThunks'
import { imgToDataUrl } from '../../utils/helper'

function Signup() {
  /* Set up formChoice variable to control status of the currently clicked
   * form option which sets the Login Mode or the Signup Mode
   */
  const [formChoice, setFormChoice] = useState('signup')
  const [errMsg, setErrMsg] = useState('')
  const [login] = useLoginMutation()
  const [signup] = useSignupMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (errMsg) {
      dispatch(setNotification(
        {
          message: errMsg,
          type: 'error',
        },
        5,
      ))
      setErrMsg('')
    }
  }, [errMsg])

  /* Create function that handles the choices click and
   * udates the state formChoice variable accordingly
   */
  const handleFormChoiceClick = (choice) => (setFormChoice(choice))

  /* onValidateSubmit function is a function that is being passed as prop
   * to the SignupForm component. This function gathers the data from the form
   * component and comes back to this Signup component with validated credentials
   * that are ready to be passed onto the Login or Signup functions.
   */
  const onValidatedSubmit = async ({ username, email, password }) => {
    if (formChoice === 'login') {
      const data = await login({ username, password })
      if (data.error?.status === 401 || data.error?.status === 403) {
        setErrMsg('Invalid Credentials')
      } else {
        try {
          const userData = data.data
          const picture = userData.picture ?? null
          const friends = userData.friends.map((friend) => ({
            ...friend,
            picture: friend.picture
              ? imgToDataUrl(friend.picture)
              : null,
          }))
          dispatch(saveProfilePictureToDB(picture))
          dispatch(setCredentials({
            ...userData,
            picture,
            friends,
          }))
          navigate('/')
        } catch (error) {
          if (error.status === 400) {
            setErrMsg('Missing Username or password')
          } else if (error.status === 500) {
            setErrMsg('Login failed')
          } else {
            setErrMsg(error.data?.error ?? error.error)
          }
        }
      }
    }
    if (formChoice === 'signup') {
      try {
        const userData = await signup({ username, email, password }).unwrap()
        const friends = userData.friends.map((friend) => ({
          ...friend,
          picture: friend.picture
            ? imgToDataUrl(friend.picture)
            : null,
        }))
        dispatch(setCredentials({
          ...userData,
          friends,
        }))
        navigate('/')
      } catch (error) {
        if (error.status === 409) {
          setErrMsg(`${error.data?.error ?? error.error}`)
        } else if (error.status === 400) {
          setErrMsg('Missing Username or password')
        } else if (error.status === 500) {
          setErrMsg('Signup failed')
        } else {
          setErrMsg(error.data?.error ?? error.error)
        }
      }
    }
  }

  return (
    <div id="signup" className={styles.Signup}>
      <div className={styles.Signup__side}>
        <Logo />
        <img src={Illustration} alt="Chats comming out of the computer screen. Conversation between 2 people." className={styles.Signup__side__illustration} />
      </div>
      <div className={styles.Signup__main}>
        <div className={styles['Signup__main__logo-container']}>
          <Logo isWhite />
        </div>
        <div className={styles['Signup__main__control-buttons']}>
          <ChoiceButton choice="login" isActive={formChoice === 'login'} handleFormChoiceClick={handleFormChoiceClick} />
          <ChoiceButton choice="signup" isActive={formChoice === 'signup'} handleFormChoiceClick={handleFormChoiceClick} />
        </div>
        <SignupForm formChoice={formChoice} onValidatedSubmit={onValidatedSubmit} />
      </div>
    </div>
  )
}

export default Signup
