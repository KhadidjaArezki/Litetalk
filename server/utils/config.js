require('dotenv').config()


/* Import app variables from .env */

/* In test mode import testing-database URI   */
/* In development and production, import the  */
/* production database URI                    */

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const PORT = process.env.PORT || 3001
const SERVER_URL = process.env.SERVER_URL
const PROD_SERVER_URL = process.env.PROD_SERVER_URL
const CLIENT_DEV_SERVER_URL = process.env.CLIENT_DEV_SERVER_URL
module.exports = {
  MONGODB_URI,
  PORT,
  SERVER_URL,
  PROD_SERVER_URL,
  CLIENT_DEV_SERVER_URL
}
