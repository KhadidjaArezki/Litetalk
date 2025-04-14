import {
  useState, forwardRef, useImperativeHandle, useEffect,
} from 'react'
import profileStyles from '../../styles/Profile-styles/Profileform.module.css'

const ProfileForm = forwardRef(({
  username, email, disable,
}, ref) => {
  const [newUsername, setUsername] = useState(username)
  const [newEmail, setEmail] = useState(email)
  const [errors, setErrors] = useState({
    username: '',
    email: '',
  })

  const isFormValid = () => {
    // Create temporary variables to store the validation status of each field
    const fieldValidationErrors = {}
    const isValidUsername = newUsername.length >= 5
    const isValidEmail = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(newEmail)

    fieldValidationErrors.username = isValidUsername ? '' : 'minimum 5 characters'
    fieldValidationErrors.email = isValidEmail ? '' : 'invalid email address'

    setErrors({ ...fieldValidationErrors })

    if (isValidUsername && isValidEmail) { return true }
    return false
  }

  useEffect(() => {
    (async () => {
      isFormValid()
    })()
  }, [newUsername, newEmail])

  useImperativeHandle(ref, () => ({
    newUsername,
    newEmail,
    isFormValid,
  }), [newUsername, newEmail, isFormValid])

  return (
    <form className={profileStyles.Profile__form}>
      <label htmlFor="username" className={profileStyles['Profile__form-label']}>
        Name
        <input
          type="text"
          name="username"
          id="user-name"
          defaultValue={newUsername}
          className={profileStyles['Profile__form-input']}
          readOnly={disable || false}
          onChange={(event) => {
            setUsername(event.target.value)
          }}
        />
        {errors.username
          ? (
            <span className={profileStyles.ProfileForm__error}>
              {errors.username}
            </span>
          ) : null}
      </label>

      <label htmlFor="email" className={profileStyles['Profile__form-label']}>
        Email
        <input
          type="email"
          name="email"
          id="user-email"
          defaultValue={newEmail}
          className={profileStyles['Profile__form-input']}
          readOnly={disable || false}
          onChange={(event) => {
            setEmail(event.target.value)
          }}
        />
        {errors.email
          ? (
            <span className={profileStyles.ProfileForm__error}>
              {errors.email}
            </span>
          ) : null}
      </label>
    </form>
  )
})

export default ProfileForm
