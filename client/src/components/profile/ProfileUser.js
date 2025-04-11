import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useUpdateUserMutation } from '../../reducers/api/userApiSlice'
import {
  selectCurrentId,
  selectCurrentUsername,
  selectCurrentEmail,
  selectCurrentPicture,
  selectCurrentFriends,
  updateProfile,
} from '../../reducers/authReducer'
import ImageModal from '../modal/ImageModal'
import ProfileButton from './ProfileButton'
import defaultPicture from '../../icons/default-user-profile-image.png'
import updateIcon from '../../icons/profile/profile-picture-update-icon.svg'
import styles from '../../styles/Profile-styles/ProfileUser.module.css'
import { saveProfilePictureToDB } from '../../reducers/thunk/authThunks'

function ProfileUser() {
  const id = useSelector(selectCurrentId)
  const username = useSelector(selectCurrentUsername)
  const email = useSelector(selectCurrentEmail)
  const { picture } = useSelector(selectCurrentPicture)
  const friends = useSelector(selectCurrentFriends)
  const [updateUser] = useUpdateUserMutation()
  const dispatch = useDispatch()
  const imageModalRef = useRef()

  const handleChangePhoto = async (imageFile) => {
    const updatedUser = await updateUser({
      id,
      username,
      email,
      friends: friends.map((f) => f.id),
      picture: imageFile,
    }).unwrap()
    const userPicture = updatedUser.picture ?? null
    dispatch(saveProfilePictureToDB(userPicture))
    dispatch(updateProfile({
      ...updatedUser,
      picture: userPicture,
    }))
  }

  return (
    <div className={styles.Profile__imgContainer}>
      <img
        src={picture ?? defaultPicture}
        alt="profile icon"
        className={`${styles.Profile__icons} ${styles.Profile__picture}`}
      />
      <ProfileButton
        imgSrc={updateIcon}
        altText="profile update icon"
        styling={styles.Profile__editPicture}
        onClick={() => imageModalRef.current.showModal()}
      />

      <ImageModal
        ref={imageModalRef}
        title="Update Your Profile Picture"
        defaultPicture={picture ?? defaultPicture}
        imageAlt="user picture"
        formHandler={handleChangePhoto}
        confirmButtonText="save"
        uploadButtonText="upload photo"
        useCameraButtonText="use camera"
      />
    </div>
  )
}

export default ProfileUser
