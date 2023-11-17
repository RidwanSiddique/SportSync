// MainNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you want to use Ionicons

import CalenderPage from './Pages/CalenderPage';
import SignUp from './Pages/SignUpPage';
import Profile from './Pages/Profile';
import Home from './Pages/HomePage';
import Team from './Pages/Team';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomePage"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="ios-home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CalenderPage"
        component={CalenderPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="ios-calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SignUpPage"
        component={SignUp}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="ios-person-add" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Team"
        component={Team}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="ios-log-in" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="ios-person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


export default MainNavigator;
