import { useState, useEffect } from 'react'
import SignupFormButton from '../button/SignupFormButton'
import SignupFormField from './SignupFormField'
import userIcon from '../../icons/signup/signup-user-icon.png'
import emailIcon from '../../icons/signup/signup-email-icon.png'
import passwordIcon from '../../icons/signup/signup-password-icon.png'
import styles from '../../styles/Signup-styles/SignupForm.module.css'

function SignupForm({ formChoice, onValidatedSubmit }) {
  // Create state variable to store:
  //    -current credentials from inputs in string (name, email, password)
  const [inputValues, setInputValues] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [isChangedInputValues, setIsChangedInputValues] = useState({
    username: false,
    email: false,
    password: false,
  })

  //    -current error message for each field in a form of a object of strings
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  })

  // isFormValid function is a function that runs only in case of the "signup" option.
  // This functions checks all the fields and updates the error messages accordingly.
  // This function returns true if all the fields are vaid and false when at least one
  // field is invalid.
  const isFormValid = () => {
    // Create temporary variables to store the validation status of each field
    const fieldValidationErrors = {}
    const isValidUsername = inputValues.username.length >= 5
    const isValidEmail = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(inputValues.email)
    const isValidPassword = inputValues.password.length >= 8

    // Based on the above validation assign the error message, or remove the error message
    // in the fieldValidationErrors variable.
    fieldValidationErrors.username = isValidUsername ? '' : 'minimum 5 characters'
    fieldValidationErrors.email = isValidEmail ? '' : 'invalid email address'
    fieldValidationErrors.password = isValidPassword ? '' : 'minimum 8 characters'

    // Assign the message status of errros (fieldValidationErrors) to the errors state variable.
    setErrors({ ...fieldValidationErrors })

    // If all the vields passed the validation return true, otherwise return false.
    if (isValidUsername && isValidEmail && isValidPassword) { return true }

    return false
  }

  useEffect(() => {
    (async () => {
      isFormValid()
    })()
  }, [inputValues])

  // Create handleInput function runs on every change of any input field.
  const handleInput = (e) => {
    // Store name (as property) and value of the current input field.
    const property = e.target.name
    const { value } = e.target

    // Update inputValues variable. It will update the current value of the used field.
    setInputValues({
      ...inputValues,
      [property]: value,
    })
    setIsChangedInputValues({
      ...isChangedInputValues,
      [property]: true,
    })
  }

  // handleSubmit function activates onSubmit when the submit button is pressed.
  const handleSubmit = (e) => {
    e.preventDefault()
    // Check if we are in the Signup mode and the signup form is valid
    // OR
    // If we are in the Login mode
    if ((formChoice === 'signup' && isFormValid()) || (formChoice === 'login')) {
      // Run the onValidateSubmit function which is the function passed from the
      // parent component as a prop. This function delivers the validated credentials.
      onValidatedSubmit({ ...inputValues })
    }
  }

  return (
    <div className={styles.SignupForm__container}>
      <h4 className={styles.SignupForm__heading}>
        {formChoice === 'login' && 'Login to your account'}
        {formChoice === 'signup' && 'Create your account'}
      </h4>
      <form
        onSubmit={handleSubmit}
        className={styles.SignupForm}
      >

        {/* Show Name Field only when the Sign Up Mode is on */}
        {(formChoice === 'signup')
          ? (
            <SignupFormField
              type="text"
              name="email"
              placeholder="Your email"
              iconSrc={emailIcon}
              handleInput={handleInput}
              formChoice={formChoice}
              error={isChangedInputValues.email ? errors.email : ''}
              value={inputValues.email}
            />
          ) : null}

        <SignupFormField
          type="text"
          name="username"
          placeholder="Your name"
          iconSrc={userIcon}
          handleInput={handleInput}
          formChoice={formChoice}
          error={isChangedInputValues.username ? errors.username : ''}
          value={inputValues.name}
        />

        <SignupFormField
          type="password"
          name="password"
          placeholder="Password"
          iconSrc={passwordIcon}
          handleInput={handleInput}
          formChoice={formChoice}
          error={isChangedInputValues.password ? errors.password : ''}
          value={inputValues.password}
        />

        <SignupFormButton choice={formChoice} type="submit" className={styles.SignupForm__button} />
      </form>
    </div>
  )
}
export default SignupForm
