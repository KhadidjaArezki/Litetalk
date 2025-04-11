import { useState, forwardRef, useImperativeHandle } from 'react'
import styles from '../../styles/Profile-styles/Profileform.module.css'

const ProfileForm = forwardRef(({
  username, email, disable,
}, ref) => {
  const [newUsername, setUsername] = useState(username)
  const [newEmail, setEmail] = useState(email)

  useImperativeHandle(ref, () => ({
    newUsername,
    newEmail,
  }), [newUsername, newEmail])

  return (
    <form className={styles.Profile__form}>
      <label htmlFor="username" className={styles['Profile__form-label']}>
        Name
        <input
          type="text"
          name="username"
          id="user-name"
          defaultValue={newUsername}
          className={styles['Profile__form-input']}
          readOnly={disable || false}
          onChange={(event) => setUsername(event.target.value)}
        />
      </label>

      <label htmlFor="email" className={styles['Profile__form-label']}>
        Email
        <input
          type="email"
          name="email"
          id="user-email"
          defaultValue={newEmail}
          className={styles['Profile__form-input']}
          readOnly={disable || false}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
    </form>
  )
})

export default ProfileForm
