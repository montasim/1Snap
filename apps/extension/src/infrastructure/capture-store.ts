import type { CaptureRecord } from '../application/capture-model';

const DATABASE_NAME = '1snap-captures';
const DATABASE_VERSION = 1;
const STORE_NAME = 'captures';
const MAX_SAVED_CAPTURES = 3;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('1Snap could not open storage.'));
  });
}

function completeTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error('1Snap could not finish a storage request.'));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error('1Snap storage was interrupted.'));
  });
}

export async function saveCapture(record: CaptureRecord): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, 'readwrite');
  transaction.objectStore(STORE_NAME).put(record);
  await completeTransaction(transaction);
  database.close();
  await pruneCaptures();
}

export async function getCapture(id: string): Promise<CaptureRecord | null> {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, 'readonly');
  const request = transaction.objectStore(STORE_NAME).get(id);
  const record = await new Promise<CaptureRecord | null>((resolve, reject) => {
    request.onsuccess = () => resolve((request.result as CaptureRecord | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error('1Snap could not read the capture.'));
  });
  await completeTransaction(transaction);
  database.close();
  return record;
}

async function pruneCaptures(): Promise<void> {
  const database = await openDatabase();
  const readTransaction = database.transaction(STORE_NAME, 'readonly');
  const request = readTransaction.objectStore(STORE_NAME).getAll();
  const records = await new Promise<CaptureRecord[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as CaptureRecord[]);
    request.onerror = () => reject(request.error ?? new Error('1Snap could not inspect storage.'));
  });
  await completeTransaction(readTransaction);

  const expired = records
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(MAX_SAVED_CAPTURES);
  if (expired.length > 0) {
    const writeTransaction = database.transaction(STORE_NAME, 'readwrite');
    const store = writeTransaction.objectStore(STORE_NAME);
    for (const record of expired) store.delete(record.id);
    await completeTransaction(writeTransaction);
  }
  database.close();
}
