import type { AnnotationDocument } from '../application/annotation-model';
import {
  ANNOTATION_STORE_NAME,
  completeTransaction,
  openCaptureDatabase,
} from './capture-database';

type StoredAnnotationDocument = {
  captureId: string;
  updatedAt: string;
  document: AnnotationDocument;
};

export async function saveAnnotationDocument(
  captureId: string,
  document: AnnotationDocument,
): Promise<void> {
  const database = await openCaptureDatabase();
  const transaction = database.transaction(ANNOTATION_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(ANNOTATION_STORE_NAME);
  if (document.items.length === 0) {
    store.delete(captureId);
  } else {
    const record: StoredAnnotationDocument = {
      captureId,
      updatedAt: new Date().toISOString(),
      document,
    };
    store.put(record);
  }
  await completeTransaction(transaction);
  database.close();
}

export async function getAnnotationDocument(captureId: string): Promise<AnnotationDocument | null> {
  const database = await openCaptureDatabase();
  const transaction = database.transaction(ANNOTATION_STORE_NAME, 'readonly');
  const request = transaction.objectStore(ANNOTATION_STORE_NAME).get(captureId);
  const result = await new Promise<StoredAnnotationDocument | null>((resolve, reject) => {
    request.onsuccess = () =>
      resolve((request.result as StoredAnnotationDocument | undefined) ?? null);
    request.onerror = () =>
      reject(request.error ?? new Error('1Snap could not read saved annotations.'));
  });
  await completeTransaction(transaction);
  database.close();
  return result?.document ?? null;
}
