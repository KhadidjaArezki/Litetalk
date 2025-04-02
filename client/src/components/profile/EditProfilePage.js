/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ProfileForm from './ProfileForm'
import styles from '../../styles/Profile-styles/EditProfile.module.css'
import Button from '../button/Button'
import {
  selectCurrentId,
  selectCurrentUsername,
  selectCurrentEmail,
  selectCurrentPicture,
  selectCurrentFriends,
} from '../../reducers/authReducer'

function EditProfilePage() {
  const id = useSelector(selectCurrentId)
  const username = useSelector(selectCurrentUsername)
  const email = useSelector(selectCurrentEmail)
  const { picture } = useSelector(selectCurrentPicture)
  const friends = useSelector(selectCurrentFriends).map((f) => f.id)

  const navigate = useNavigate()

  const handleSave = (event) => {
    // TODO: save the edit
    event.preventDefault()
    const newUsername = event.target.username.value
    const newEmail = event.target.email.value
  }

  const handleCancel = () => {
    // cancel the edit and return back to profile
    navigate('/profile')
  }

  return (
    <div role="contentinfo" className={styles.Edit__container}>
      <h2 className={styles.Edit__heading}>Edit Profile Information</h2>
      <ProfileForm username={username} email={email} disable={false} />
      <Button
        text="Save"
        className={styles.Edit__button}
        onClick={handleSave}
      />
      <Button
        text="Cancel"
        className={`${styles.Edit__button}, ${styles.Edit__buttonCancel}`}
        onClick={handleCancel}
      />
    </div>
  )
}

export default EditProfilePage
