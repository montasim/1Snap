import type { CaptureRecord } from '../application/capture-model';
import {
  ANNOTATION_STORE_NAME,
  CAPTURE_STORE_NAME,
  completeTransaction,
  openCaptureDatabase,
} from './capture-database';

const MAX_SAVED_CAPTURES = 3;

export async function saveCapture(record: CaptureRecord): Promise<void> {
  const database = await openCaptureDatabase();
  const transaction = database.transaction(CAPTURE_STORE_NAME, 'readwrite');
  transaction.objectStore(CAPTURE_STORE_NAME).put(record);
  await completeTransaction(transaction);
  database.close();
  await pruneCaptures();
}

export async function getCapture(id: string): Promise<CaptureRecord | null> {
  const database = await openCaptureDatabase();
  const transaction = database.transaction(CAPTURE_STORE_NAME, 'readonly');
  const request = transaction.objectStore(CAPTURE_STORE_NAME).get(id);
  const record = await new Promise<CaptureRecord | null>((resolve, reject) => {
    request.onsuccess = () => resolve((request.result as CaptureRecord | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error('1Snap could not read the capture.'));
  });
  await completeTransaction(transaction);
  database.close();
  return record;
}

async function pruneCaptures(): Promise<void> {
  const database = await openCaptureDatabase();
  const readTransaction = database.transaction(CAPTURE_STORE_NAME, 'readonly');
  const request = readTransaction.objectStore(CAPTURE_STORE_NAME).getAll();
  const records = await new Promise<CaptureRecord[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as CaptureRecord[]);
    request.onerror = () => reject(request.error ?? new Error('1Snap could not inspect storage.'));
  });
  await completeTransaction(readTransaction);

  const expired = records
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(MAX_SAVED_CAPTURES);
  if (expired.length > 0) {
    const writeTransaction = database.transaction(
      [CAPTURE_STORE_NAME, ANNOTATION_STORE_NAME],
      'readwrite',
    );
    const captureStore = writeTransaction.objectStore(CAPTURE_STORE_NAME);
    const annotationStore = writeTransaction.objectStore(ANNOTATION_STORE_NAME);
    for (const record of expired) {
      captureStore.delete(record.id);
      annotationStore.delete(record.id);
    }
    await completeTransaction(writeTransaction);
  }
  database.close();
}
