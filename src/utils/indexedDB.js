// IndexedDB ochish funksiyasi
export const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDatabase', 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Faylni IndexedDB'ga saqlash
export const saveToIndexedDB = async (file) => {
  if (!file || !(file instanceof Blob)) {
    console.error('Xatolik: noto‘g‘ri fayl!')
    return
  }

  const db = await openDB()
  const reader = new FileReader()

  reader.onload = () => {
    const tx = db.transaction('files', 'readwrite')
    const store = tx.objectStore('files')
    store.put({ id: new Date().getTime(), data: reader.result })
  }

  reader.readAsDataURL(file)
}
// Get file from IndexedDB
export const getFromIndexedDB = async (id) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readonly')
    const store = tx.objectStore('files')
    const request = store.get(id)

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.data)
      } else {
        reject('File not found')
      }
    }
    request.onerror = () => reject(request.error)
  })
}
export const getAllFromIndexedDB = async () => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readonly')
    const store = tx.objectStore('files')
    const request = store.getAll()

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.map((item) => item.data))
      } else {
        reject('No files found')
      }
    }
    request.onerror = () => reject(request.error)
  })
}
