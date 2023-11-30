//authContext.js
import { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
    case 'LOGIN':
        //console.log('LOGIN action dispatched with payload:', action.payload); // For debugging purposes
        return { user: action.payload };
    case 'LOGOUT':
        return { user: null };
    default:
        return state || { user: null };
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
    user: null,
    });

    useEffect(() => {
    const loadUser = async () => {
        try {
        // Load user data from AsyncStorage
        const userJson = await AsyncStorage.getItem('user');
        //console.log('User from AsyncStorage:', userJson); // For debugging purposes
        if (userJson) {
            const user = JSON.parse(userJson);
            dispatch({ type: 'LOGIN', payload: user });
            //console.log('User loaded:', user); // For debugging purposes
        }
        } catch (error) {
        console.error('Error loading user data:', error);
        }
    };

    loadUser();
    }, []);

    return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
        {children}
    </AuthContext.Provider>
    );
};