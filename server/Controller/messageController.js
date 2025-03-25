// import the models
const Message = require('../models/message')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { getTokenFromHeader } = require('../utils/helper')
const { getUser } = require('../socket/index')

// import helper function
const errorConfig = require('../utils/helper')

// controller to fetch user messages
const getMessageController = async (req, res, next) => {
  // get the user id from the request body
  const { user_id: id } = req.params

  // if there is no user id in the request,
  // throw client error
  if (!id) {
    const error = errorConfig(
      'ValidationError',
      'User id field is required',
      400,
    )
    next(error)
  }
  
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

  // if there is an id, then
  try {
    // query the database for every messages where user is sender or receiver
    const userMessages = await Message.find().or([
      { sender: id },
      { receiver: id },
    ])

    const chatsObj = {}
    userMessages.forEach(m => {
      const friendId = m.sender == id ? m.receiver : m.sender
      if (! (friendId in chatsObj) ) chatsObj[friendId] = []
      chatsObj[friendId].push(m)
    })

    const chats = []
    for (const friendId in chatsObj) {
      chats.push({
        friendId,
        messages: chatsObj[friendId]
      })
    }
    res.status(200).send(chats)
  } catch (error) {
    // if there is an error, pass it to the error middleware
    next(error)
  }
}

// controller to send user messages
const postMessageController = async (req, res, next) => {
  const token = getTokenFromHeader(req)
  /* use the stored secret to validate the token */
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  // get the request payload
  // eslint-disable-next-line object-curly-newline
  const { userId, friendId, timestamp } = req.body
  // content is either a string or an image file
  const content = req.body.content ?? {
    data: new Buffer.from(req.file.buffer, 'base64'),
    contentType: req.file.mimetype
  }

  // check if there is no message,
  // and if so pass control to the error handling middleware
  if (![userId, friendId, content, timestamp].every(Boolean)) {
    const error = errorConfig(
      'ValidationError',
      'Require userId, friendId, content and timestamp to not be null or undefined',
      400,
    )
    next(error)
  }

  try {
    const message = {
      content,
      receiver: friendId,
      sender: userId,
      timestamp,
    }
    const newMessage = new Message(message)
    const result = await newMessage.save()
    const io = req.app.locals.io
    const receiver = getUser(friendId)
    io.to(receiver?.socketId).emit('getMessage', {
      userId,
      message,
      timestamp,
    })
    res.status(201).send(result)
  } catch (error) {
    // if the operation is unsuccessful,
    // pass the error to the error middlware
    next(error)
  }
}

module.exports = {
  getMessageController,
  postMessageController,
}
