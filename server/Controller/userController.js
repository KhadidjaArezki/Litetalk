const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Message = require('../models/message')
const { generateAllTokens, getTokenFromHeader } = require('../utils/helper')

const getUsersController = async (_, res) => {
  /* Return all users and populate the contacts array with friends usernames */
  const users = await User
    .find({})
    .populate('contacts', { username: 1 })

  res.json(users)
}

/* Controller to create a new user */
const postUserController = async (req, res) => {
  const { username, email, password } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
 
  const user = new User({
    username,
    email,
    passwordHash,
    picture: null,
    contacts: ['67fc2c2ee22742f7f9d67ac2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  
  const createdUser = await user.save()

  /* Create token and refresh token */
  const { token, refreshToken } = generateAllTokens(createdUser)

  /* Update token and refresh token in user document */
  const userToUpdate = {
    refreshToken: [refreshToken],
  }

  /* findByIdAndUpdate here takes three arguments the user id, an object with the fields */
  /* to update, and an options object. if the `new `field is true, return the modified   */
  /* document rather than the original.                                                  */
 
  const updatedUser = await User.findByIdAndUpdate(
    createdUser._id,
    userToUpdate,
    { new: true },
  ).populate('contacts', {
    username: 1,
    picture: 1,
  })

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
  res.status(201).json({
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    picture: updatedUser.picture,
    friends: updatedUser.contacts,
    token: token,
  })
}

/* Controller to update user profile */
const putUserController = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user) {
    return res.status(404).end()
  }

  const token = getTokenFromHeader(req)
  /* use the stored secret to validate the token */
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  /* If the id from the decoded token and the id from  */
  /* the user document do not match, return auth error */
  if (!( decodedToken.id.toString() === user.id.toString() )) {
    return res.status(401).json({
      error: 'Access Denied'
    })
  }

  const { username, email } = req.body
  let friends = JSON.parse(req.body.friends)

  /* picture can be null or an array of bytes */
  const picture = req.body.picture === "null"
    ? null
    : {
      data: new Buffer.from(req.file.buffer, 'base64'),
      contentType: req.file.mimetype
    }
  // remove duplicate friends and prevent user from befriending themselves
  friends = [...new Set(friends)].filter(f => f != user.id)
  const userToUpdate = {
    username,
    email,
    picture,
    contacts: friends,
    updatedAt: new Date().toISOString(),
  }

/* The populate method is then called on the query object created by findByIdAndUpdate */
  /* It is used to fetch data from other documents or collections to fill the fields we  */
  /* need from our reference field: contacts. populate takes two arguments: the field to */
  /* populate - contacts - and an object representing the data that must be returned.    */
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    userToUpdate,
    { new: true},
  ).populate('contacts', {
    username: 1,
    picture: 1,
  })

  res.status(200).json({
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    picture: updatedUser.picture,
    friends: updatedUser.contacts,
  })
}

/* Controller to delete user profile */
const deleteUserController = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).end()
  }
  
  const token = getTokenFromHeader(req)
  /* use the stored secret to validate the token */
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  /* If the id from the decoded token and the id from  */
  /* the user document do not match, return auth error */
  if (!( decodedToken.id.toString() === user.id.toString() )) {
    return res.status(401).json({
      error: 'Access Denied'
    })
  }

  try {
    // Delete all messages where the user is either the sender or receiver
    await Message.deleteMany({
      $or: [{ sender: req.params.id }, { receiver: req.params.id }],
    })
    await User.findByIdAndRemove(req.params.id)

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    res.status(200).json({
      success: true,
      message: "user deleted"
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to delete user'
    })
  } 
}

module.exports={
  getUsersController,
  postUserController,
  putUserController,
  deleteUserController,
}
