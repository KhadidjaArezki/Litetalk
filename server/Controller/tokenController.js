const jwt = require('jsonwebtoken')
const User = require('../models/user')

/* Get a new auth token by sending a refresh
   token via an httpOnly secure cookie.
   Every refresh token is used once at most and
   then deleted and replaced in db and cookie.
*/
const getTokenController = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) {
    console.log(cookies)
    return res.sendStatus(401)
  }

  const oldRefreshToken = cookies.jwt
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  })

  // Calling exec is not neccessary, but helps with debugging
  const foundUser = await User.findOne({ refreshToken: oldRefreshToken }).exec()

  jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err?.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Refresh token missing or invalid",
      })
    }
    // Detected refresh token reuse!
    if (!foundUser) {
      const hackedUser = await User.findOne({
        username: decoded.username,
      }).exec()
      hackedUser.refreshToken = []
      hackedUser.updatedAt = new Date().toISOString()
      await hackedUser.save()
      return res.sendStatus(403) //Forbidden
    }

    // Remove old rt token from user rt array
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== oldRefreshToken
    )
    // remove expired refresh token from user's rt array
    if (err?.name === "TokenExpiredError") {
      foundUser.refreshToken = [...newRefreshTokenArray]
      foundUser.updatedAt = new Date().toISOString()
      await foundUser.save()
      return res.status(403).json({
        error: "Refresh token expired",
      })
    }
    // Check that rt corresponds to our user
    if (foundUser.username !== decoded.username) return res.sendStatus(403)

    // All is good
    const { token, refreshToken } = generateAllTokens(foundUser)
    const newRefreshToken = refreshToken
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
    foundUser.updatedAt = new Date().toISOString()
    await foundUser.save()

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 12 * 60 * 60 * 1000,
    })
    res.status(200).json({ token })
  })
}

/* Controller to delete user's refresh token on logout */
const deleteTokenController = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  const oldRefreshToken = cookies.jwt

  // Is refreshToken in db? If not, reuse detected!
  const foundUser = await User.findOne({ refreshToken: oldRefreshToken }).exec()
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    return res.sendStatus(204)
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== oldRefreshToken
  )
  foundUser.updatedAt = new Date().toISOString()
  await foundUser.save()

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  })
  res.sendStatus(204)
}

module.exports = {
  getTokenController,
  deleteTokenController,
}