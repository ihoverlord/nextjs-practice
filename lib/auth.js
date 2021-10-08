import React, {useState, useEffect, useContext, createContext} from 'react';
import { createUser } from './db';
import firebase from './firebase'

const authContext = createContext();

export function ProvideAuth({children}) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const handleUser = (rawUser) => {
        if(rawUser) {
            const temp = formatUser(rawUser)
            createUser(temp.uid, temp)
            setUser(temp)
            return temp
        } else {
            setUser(null)
            return false
        }
    }
    const signin = (email, password) => {
        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => handleUser(response.user));
    };

    const signinWithGithub = () => {
        return firebase 
            .auth()
            .signInWithPopup(new firebase.auth.GithubAuthProvider())
            .then((response) => handleUser(response.user));
    }

    const signout = () => {
        return firebase
            .auth()
            .signOut()
            .then(handleUser);
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

        return () => unsubscribe();
    }, []);
    
    return {
        user,
        signin,
        signout,
        signinWithGithub
    };
}

const formatUser = (user) => {
    // const token = await user.getIdToken();

    const obj = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      provider: user.providerData[0].providerId,
      photoUrl: user.photoURL,
    //   stripeRole: await getStripeRole(),
    //   token
    };
    return obj
  };