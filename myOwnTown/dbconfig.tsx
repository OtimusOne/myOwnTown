import * as firebase from 'firebase';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@firebase/firestore';
import ignoreWarnings from 'react-native-ignore-warnings';

ignoreWarnings('Setting a timer');
const firebaseConfig = {
  apiKey: 'AIzaSyBXWT01K7IyAeqfpdjUwzQrCADtu4Kbyr0',
  authDomain: 'myowntown-13a47.firebaseapp.com',
  databaseURL: 'https://myowntown-13a47.firebaseio.com',
  projectId: 'myowntown-13a47',
  storageBucket: 'myowntown-13a47.appspot.com',
  messagingSenderId: '709025483061',
  appId: '1:709025483061:web:274bb765c91cb36f2aa47c',
};

firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line import/prefer-default-export
export const firestore = firebase.firestore();
export const storage = firebase.storage();