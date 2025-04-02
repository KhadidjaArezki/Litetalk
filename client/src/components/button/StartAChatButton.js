import Button from './Button'

import chatIcon from '../../icons/chats/chats-cta-icon.png'

function StartAChatButton({ handleOnClick, btnText, btnStyles }) {
  return (
    <Button
      text={btnText}
      className={btnStyles}
      onClick={handleOnClick}
      icon={chatIcon}
      iconAlt="a chat icon"
    />
  )
}

export default StartAChatButton
