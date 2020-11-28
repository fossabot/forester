import {
  assertFails,
  assertSucceeds,
  clearFirestoreData,
  initializeTestApp,
} from '@firebase/testing';
import firebase from 'firebase';

const PROJECT_ID = 'k0swe-kellog';
const MY_UID = 'k0swe';
const MY_AUTH = { uid: MY_UID };
const THEIR_UID = 'n0call';
const THEIR_AUTH = { uid: THEIR_UID };
const ANONYMOUS: object = null;

describe('Firestore rules', () => {
  beforeEach(async () => {
    await clearFirestoreData({ projectId: PROJECT_ID });
  });
  afterAll(async () => {
    await clearFirestoreData({ projectId: PROJECT_ID });
  });

  function getFirestore(auth?: object): firebase.firestore.Firestore {
    // @ts-ignore
    return initializeTestApp({ projectId: PROJECT_ID, auth }).firestore();
  }

  it('should allow a user to read their own document', async () => {
    const db = getFirestore(MY_AUTH);
    const myDoc = db.collection('users').doc(MY_UID);
    await assertSucceeds(myDoc.get());
    expect().nothing();
  });

  it('should allow a user to write to their own document', async () => {
    const db = getFirestore(MY_AUTH);
    const myDoc = db.collection('users').doc(MY_UID);
    await assertSucceeds(myDoc.set({ callsign: 'K0SWE' }));
    expect().nothing();
  });

  it('should deny a user from reading a different user document', async () => {
    const db = getFirestore(THEIR_AUTH);
    const myDoc = db.collection('users').doc(MY_UID);
    await assertFails(myDoc.get());
    expect().nothing();
  });

  it('should deny a user from writing to a different user document', async () => {
    const db = getFirestore(THEIR_AUTH);
    const myDoc = db.collection('users').doc(MY_UID);
    await assertFails(myDoc.set({ callsign: 'N0CALL' }));
    expect().nothing();
  });

  it('should deny anon from reading a user document', async () => {
    const db = getFirestore(ANONYMOUS);
    const myDoc = db.collection('users').doc(MY_UID);
    await assertFails(myDoc.get());
    expect().nothing();
  });

  it('should deny anon from writing to a user document', async () => {
    const db = getFirestore(ANONYMOUS);
    const myDoc = db.collection('users').doc(MY_UID);
    await assertFails(myDoc.set({ callsign: 'nobody' }));
    expect().nothing();
  });
});
