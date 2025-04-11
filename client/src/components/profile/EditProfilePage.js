/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useUpdateUserMutation } from '../../reducers/api/userApiSlice'
import {
  selectCurrentId,
  selectCurrentUsername,
  selectCurrentEmail,
  selectCurrentPicture,
  selectCurrentFriends,
  updateProfile,
} from '../../reducers/authReducer'
import ProfileForm from './ProfileForm'
import styles from '../../styles/Profile-styles/EditProfile.module.css'
import Button from '../button/Button'
import { saveProfilePictureToDB } from '../../reducers/thunk/authThunks'

function EditProfilePage() {
  const id = useSelector(selectCurrentId)
  const username = useSelector(selectCurrentUsername)
  const email = useSelector(selectCurrentEmail)
  const { file } = useSelector(selectCurrentPicture)
  const friends = useSelector(selectCurrentFriends).map((f) => f.id)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [updateUser] = useUpdateUserMutation()
  const profileFormRef = useRef({})

  const handleSave = async (event) => {
    event.preventDefault()
    const { newUsername, newEmail } = profileFormRef.current

    const pictureFileToSend = file?.data
      ? new File(
        [new Blob([new Uint8Array(file.data.data)], { type: file.contentType })],
        `${username}.${file.contentType.substring(file.contentType.indexOf('/') + 1)}`,
        { type: file.contentType },
      )
      : null
    const updatedUser = await updateUser({
      id,
      username: newUsername,
      email: newEmail,
      friends,
      picture: pictureFileToSend,
    }).unwrap()
    dispatch(saveProfilePictureToDB(updatedUser.picture))
    dispatch(updateProfile(updatedUser))
    navigate('/profile')
  }

  const handleCancel = () => {
    navigate('/profile')
  }

  return (
    <div role="contentinfo" className={styles.Edit__container}>
      <h2 className={styles.Edit__heading}>Edit Profile Information</h2>
      <ProfileForm username={username} email={email} disable={false} ref={profileFormRef} />
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
