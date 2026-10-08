import {createContext, useContext, type ReactNode} from "react";
import type { AuthState } from "../types/auth";
import { useState, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";

interface AuthContextProps {
    authState: AuthState;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [authState, setAuthState] = useState<AuthState>({
        user: null,
        error: null,
        loading: false,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setAuthState({
                    user: {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    },
                    error: null,
                    loading: false,
                });
            } else {
                setAuthState({
                    user: null,
                    error: null,
                    loading: false,
                });
            }
        }, (error) => {
            console.error("Error observing auth state:", error);
            setAuthState({
                user: null,
                error: error.message,
                loading: false,
            });
        },
    );

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async (): Promise<void> => {
        setAuthState((prevState) => ({
            ...prevState,
            loading: true,
        }));

        try {
            await signInWithPopup(firebaseAuth, googleAuthProvider);
        } catch (err) {
            console.error("Error signing in with Google:", err);
            setAuthState((prevState) => ({
                ...prevState,
                error: (err as Error).message,
            }));
        }
    };


    const signOut = async (): Promise<void> => {
        setAuthState((prevState) => ({
            ...prevState,
            loading: true,
        }));

        try {
            await firebaseSignOut(firebaseAuth);
        } catch (err) {
            console.error("Error signing out:", err);
            setAuthState((prevState) => ({
                ...prevState,
                error: (err as Error).message,
            }));
        }
    };

    return (
        <AuthContext.Provider value={{ authState, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;

};