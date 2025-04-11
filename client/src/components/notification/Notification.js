import { useSelector } from 'react-redux'
import { selectCurrentMessage, selectCurrentType } from '../../reducers/notificationReducer'
import styles from '../../styles/Notification.module.css'

function Notification() {
  const message = useSelector(selectCurrentMessage)
  const type = useSelector(selectCurrentType)
  const classes = `${styles.notification} ${type && styles[type]}`

  return (
    <div className={classes}>
      {message}
    </div>
  )
}

export default Notification
