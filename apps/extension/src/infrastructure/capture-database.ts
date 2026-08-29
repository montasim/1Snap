export const DATABASE_NAME = '1snap-captures';
export const DATABASE_VERSION = 2;
export const CAPTURE_STORE_NAME = 'captures';
export const ANNOTATION_STORE_NAME = 'annotations';

export function openCaptureDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(CAPTURE_STORE_NAME)) {
        const store = database.createObjectStore(CAPTURE_STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
      if (!database.objectStoreNames.contains(ANNOTATION_STORE_NAME)) {
        database.createObjectStore(ANNOTATION_STORE_NAME, { keyPath: 'captureId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('1Snap could not open storage.'));
  });
}

export function completeTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error('1Snap could not finish a storage request.'));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error('1Snap storage was interrupted.'));
  });
}
