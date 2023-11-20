// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainNavigator from './MainNavigator';
import SignUpPage from './Pages/SignUpPage'
import SignInPage from './Pages/SignInPage';
import ForgotPassword from './Pages/ForgotPassPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
    <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} /> 
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> 
        <Stack.Screen name="MainNavigator" component={MainNavigator} />
    </Stack.Navigator>
    );
};

export default AppNavigator;