import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  selectCurrentUsername,
  selectCurrentPicture,
  resetCredentials,
} from '../../reducers/authReducer'
import styles from '../../styles/User.module.css'
import { ReactComponent as UserIcon } from '../../icons/profile/profile-user-icon.svg'
import { ReactComponent as LogoutIcon } from '../../icons/profile/profile-logout-icon.svg'
import { useLogoutMutation } from '../../reducers/api/authApiSlice'
import { saveProfilePictureToDB } from '../../reducers/thunk/authThunks'

function User() {
  const username = useSelector(selectCurrentUsername)
  const { picture } = useSelector(selectCurrentPicture)
  const [logout] = useLogoutMutation()
  const userRef = useRef()
  const dispatch = useDispatch()

  const handleUserClick = () => {
    userRef.current.classList.toggle('open')
  }

  const handleLogout = async () => {
    await logout()
    dispatch(saveProfilePictureToDB(null))
    dispatch(resetCredentials())
  }

  return (
    <div
      ref={userRef}
      className={styles.user}
    >
      <div
        role="button"
        className={styles.user__icon}
        onClick={handleUserClick}
        onKeyDown={handleUserClick}
        tabIndex={0}
      >
        <img src={picture} alt={username} />
      </div>

      <div className={styles.user__dropdown}>
        <h5>{username}</h5>
        <div className={styles.user__links}>
          <Link
            className={styles.user__link}
            to="/profile"
          >
            <UserIcon className={styles['user__link-icon']} />
            My Profile
          </Link>
          <button
            type="button"
            className={styles.user__link}
            onClick={handleLogout}
          >
            <LogoutIcon className={styles['user__link-icon']} />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default User
