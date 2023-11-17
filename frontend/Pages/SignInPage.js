// Import necessary modules
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// Create the SignIn component
const SignIn = () => {
  // State variables for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get the navigation object
  const navigation = useNavigation();

  // Function to handle sign-in
  const handleSignIn = async () => {
    try {
      // Send a POST request to the server for sign-in
      const response = await axios.post('https://172.16.1.177:3000/sportSync/login', {
        email,
        password,
      });

      // Check if the login was successful
      if (response.data.message === 'passed') {
        // Login successful, navigate to the MainNavigator
        navigation.navigate('MainNavigator');
      } else {
        // Login failed, show an error message
        console.log('Login failed');
      }
    } catch (error) {
      // Handle any errors
      if (error.response) {
        // The request was made, but the server responded with a status code outside the range of 2xx
        console.log('Server responded with an error:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received from the server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
      }
    }
  };
  
  // Function to handle navigation to the sign-up screen
  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  // Function to handle form submission
  const handleSubmit = () => {
    handleSignIn();
  };

  // Render the sign-in component
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign In</Text>
      <TextInput
        placeholder="Email Address"
        onChangeText={(text) => setEmail(text)}
        value={email}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.signInButton}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUpPress}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the sign-in component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '80%',
  },
  signInButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    fontSize: 16,
    color: '#007BFF',
  },
});

export default SignIn;