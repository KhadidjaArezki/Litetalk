const bcrypt = require('bcrypt')
const User = require('../models/user')
const { generateAllTokens } = require('../utils/helper')

const loginController = async (req, res) => {
  const cookies = req.cookies
  const { username, password } = req.body
  const user = await User.findOne({ username: username })

  /* If user was not found or password is incorrect     */
  /* passwordCorrect is equal to false, otherwise, true */
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid user credentials'
    })
  }

  const { token, refreshToken } = generateAllTokens(user)
  const newRefreshToken = refreshToken
  // If a cookie is sent with an rt, remove it from user rt array
  // to be replaced by a new one.
  let newRefreshTokenArray = !cookies?.jwt
    ? user.refreshToken
    : user.refreshToken.filter((rt) => rt !== cookies.jwt)

  if (cookies?.jwt) {
    const refreshToken = cookies.jwt
    const foundToken = await User.findOne({ refreshToken }).exec()

    /* Detected refresh token reuse!
     * clear user's stored RTs and cookie
     */
    if (!foundToken) {
      newRefreshTokenArray = []
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
  }

  // Saving refreshToken with current user
  const userToUpdate = {
    refreshToken: [...newRefreshTokenArray, newRefreshToken]
  }
  const updatedUser = await User.findByIdAndUpdate(
    user.id,
    {
      ...userToUpdate,
      updatedAt: new Date().toISOString(),
    },
    { new: true },
  ).populate('contacts', {
    username: 1,
    picture: 1,
  })

  // Creates Secure Cookie with refresh token
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 12 * 60 * 60 * 1000,
  })

  res.status(200).json({
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    picture: updatedUser.picture,
    friends: updatedUser.contacts,
    token: token,
  })
}

module.exports = {
  loginController,
}
