import React, { useEffect, useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configure Firebase.
const firebaseConfig = {
  apiKey: 'AIzaSyAdFbxS2X0pwVGJ4bmHA9fLXNaVBBGFNiU',
  authDomain: 'dicom-viewer-dac76.firebaseapp.com',
  projectId: 'dicom-viewer-dac76',
  storageBucket: 'dicom-viewer-dac76.appspot.com',
  messagingSenderId: '750983084381',
  appId: '1:750983084381:web:6656624587b20ba563d0b4',
};

firebase.initializeApp(firebaseConfig);

export const auth = getAuth();

export const useFirebaseAuth = () => {
  const history = useHistory();
  const [isSignedIn] = useState(false);
  const [error, setError] = useState('');

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      // setIsSignedIn(!!user);
      if (user) {
        history.push('/backstage');
      } else {
        history.push('/backstage/login');
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithEmail = ({ email, password }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log({
          user,
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorCode);
        console.log({
          errorMessage,
        });
      });
  };

  const signOut = () => {
    auth.signOut();
  };

  return {
    auth,
    signInWithEmail,
    isSignedIn,
    signOut,
    setError,
    error,
  };
};

export const Context = createContext({});
export const useFirebaseAuthService = () => useContext(Context);
export const FirebaseAuthProvider = ({ children }) => {
  return (
    <Context.Provider value={useFirebaseAuth()}>{children}</Context.Provider>
  );
};

FirebaseAuthProvider.propTypes = {
  children: PropTypes.node,
};
