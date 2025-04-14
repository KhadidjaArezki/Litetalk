# Litetalk Backend

This server uses Json Web Tokens to authenticate requests. The authentication model depends on refresh tokens - sent in a secure cookie - to avoid frequent signin. Refresh token rotation and reuse detection is implemented to block unauthorized requests.

## Stack

This project uses the MERN stack:

- Mongoose.js (MongoDB): database
- Express.js: backend framework
- React: frontend framework
- Redux: frontend state management
- Node.js: backend runtime environment

## Routers

### User

- Handles signup requests
- Handle user's profile update
- Handle delete profile requests
- Get list of all users

### Login

- Handles login requests

### Token

- Handles requests for new access token
- Logs the user and clear the cookie

### Message

- Get all messages send or received by a particular user
- Create a new message for user

### People

- Search users collection for people with names matching the search keywords

## Models

### User

Defines a schema with 5 main fields:
- local fields: username, email, passwaord hash, and picture
- contacts: an array of references to users that are friends with user

### Message

Defines a schema with four fields:
- two local fields: content, and timestamp
- two reference fields: sender, and receiver. Refs to the User collection


