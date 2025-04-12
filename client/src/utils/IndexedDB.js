/* eslint no-unused-vars: 0 */
export async function openImageDB() {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('ImageDB', 2)
    dbRequest.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('images')) {
        // console.log('Creating object store...')
        db.createObjectStore('images', { keyPath: 'id' })
      }
    }
    dbRequest.onsuccess = (e) => {
      resolve(e.target.result)
    }
    dbRequest.onerror = (e) => {
      // console.error('Failed to open IndexedDB:', e.target.error)
      reject(e.target.error)
    }
  })
}

export async function saveProfilePicture(imageFile) {
  try {
    const db = await openImageDB()
    const tx = db.transaction('images', 'readwrite')
    const store = tx.objectStore('images')
    if (imageFile !== null) {
      store.put({ id: 1, data: imageFile })
    } else {
      store.delete(1)
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        resolve(true)
      }
      tx.onerror = (e) => {
        // console.error('Save failed:', e.target.error)
        reject(e.target.error)
      }
    })
  } catch (err) {
    // console.error('Error saving profile picture:', err)
    return false
  }
}

export async function getProfilePicture() {
  try {
    const db = await openImageDB()
    const tx = db.transaction('images', 'readonly')
    const store = tx.objectStore('images')
    const getRequest = store.get(1)

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = (e) => {
        const { result } = e.target
        resolve(result?.data ?? null)
      }
      getRequest.onerror = (e) => {
        // console.error('Error fetching profile picture:', e.target.error)
        resolve(null)
      }
    })
  } catch (err) {
    // console.error('Error accessing profile picture:', err)
    return null
  }
}
