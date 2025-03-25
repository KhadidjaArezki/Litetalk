import { useRef } from 'react'
import ImageModal from '../modal/ImageModal'
import ProfileButton from './ProfileButton'
import defaultPicture from '../../icons/default-user-profile-image.png'
import updateIcon from '../../icons/profile/profile-picture-update-icon.svg'
import styles from '../../styles/Profile-styles/ProfileUser.module.css'

function ProfileUser({ userPicture }) {
  // get the modal ref
  const imageModalRef = useRef()
  // change photo handler
  const handleChangePhoto = () => {
    // do something
  }

  return (
    <div className={styles.Profile__imgContainer}>
      <img
        src={userPicture || defaultPicture}
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
        defaultPicture={userPicture || defaultPicture}
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
