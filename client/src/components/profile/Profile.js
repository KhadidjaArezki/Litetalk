/* eslint-disable react/self-closing-comp */
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentId,
  selectCurrentUsername,
  selectCurrentEmail,
  selectCurrentPicture,
  resetCredentials,
} from '../../reducers/authReducer'
import { useRemoveUserMutation } from '../../reducers/api/userApiSlice'
import ProfileForm from './ProfileForm'
import ProfileButton from './ProfileButton'
import ProfileUser from './ProfileUser'
import Modal from '../modal/Modal'
import editIcon from '../../icons/profile/profile-edit-icon.svg'
import deleteIcon from '../../icons/profile/profile-delete-icon.svg'
import styles from '../../styles/Profile-styles/Profile.module.css'

function Profile() {
  const id = useSelector(selectCurrentId)
  const username = useSelector(selectCurrentUsername)
  const email = useSelector(selectCurrentEmail)
  const { picture } = useSelector(selectCurrentPicture)

  const [removeUser] = useRemoveUserMutation()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const modalRef = useRef()

  const handleDeleteProfile = async () => {
    await removeUser(id)
    dispatch(resetCredentials())
    navigate('/')
  }

  return (
    <div role="contentinfo" className={styles.Profile}>
      {/* header section contains the profile heading and profile
      actions buttons */}
      <header className={styles.Profile__heading}>
        <h2 className={styles.Profile__headText}>Profile</h2>
        <div className={styles.Profile__cta}>
          <Link to="/edit">
            <ProfileButton imgSrc={editIcon} altText="edit icon" />
          </Link>
          <ProfileButton
            onClick={() => modalRef.current.showModal()}
            imgSrc={deleteIcon}
            altText="delete icon"
          />
        </div>
      </header>

      {/* main section of the profile page contains the profile
      picture, the icon to edit it, and profile form controls */}
      <main className={styles.Profile__main}>
        <ProfileUser />
        <ProfileForm username={username} email={email} disable="yes" />
      </main>

      <Modal
        ref={modalRef}
        title="Confirm Delete"
        text="Are you sure you want to delete your profile?"
        onRequestClose={() => modalRef.current.close()}
        confirmButtonText="DELETE"
        buttonClasses="button--danger"
        formHandler={handleDeleteProfile}
      />
    </div>
  )
}

export default Profile
