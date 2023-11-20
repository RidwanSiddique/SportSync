import { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
    case 'LOGIN':
        return { user: action.payload };
    case 'LOGOUT':
        return { user: null };
    default:
        return state;
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
        if (userJson) {
            const user = JSON.parse(userJson);
            dispatch({ type: 'LOGIN', payload: user });
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