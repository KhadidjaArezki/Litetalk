import { setProfilePictureFile } from '../authReducer'
import { saveProfilePicture } from '../../utils/IndexedDB'

export const saveProfilePictureToDB = (filePromise) => async (dispatch) => {
  let file = null
  try {
    file = await filePromise
  } catch (e) {
    file = filePromise
  }
  try {
    const result = await saveProfilePicture(file)
    if (result && file) {
      dispatch(setProfilePictureFile(file))
    }
    // console.log('Saved image to IndexedDB:', result)
  } catch (err) {
    console.error('Failed to save image file:', err)
  }
}

/*
export const loadProfilePictureFromDB = () => async (dispatch) => {
  try {
    const file = await getProfilePicture()
    if (file) {
      dispatch(setProfilePictureFile(file))
    }
  } catch (err) {
    console.error('Failed to load profile picture from DB:', err)
  }
}
*/
