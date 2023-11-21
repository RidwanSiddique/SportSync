// SiginInPage.js  
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext'; 

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { dispatch } = useContext(AuthContext);

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:3000/sportSync/login', {
        email,
        password,
      });

      if (response.data.message === 'passed') {
        // Login successful, dispatch LOGIN action
        dispatch({ type: 'LOGIN', payload: { token: response.data.token } });
        Alert.alert('Login Successful', 'Welcome to SportSync!');
        // Navigate to the main navigator
        navigation.navigate('MainNavigator');
      } else {
        // Login failed, show an error message
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      // Handle specific errors and show appropriate alerts
      if (error.response) {
        if (error.response.status === 401) {
          // Unauthorized (wrong email or password)
          Alert.alert('Login Failed', 'Email does not exist. Sign up to create an account.');
        } 
        else if (error.response.status === 408) {
          // empty email and password field.
          Alert.alert('Login Failed', 'All Fields must be filled!');
        }
        
        else if (error.response.status === 405) {
          // empty password field.
          Alert.alert('Login Failed', 'Must enter a password!');
        }
        else if (error.response.status === 406) {
          // empty email field.
          Alert.alert('Login Failed', 'Must enter an email!');
        }
        else if (error.response.status === 407) {
          // empty email field.
          Alert.alert('Login Failed', 'Invalid email! Please enter a valid email.');
        }
        else if (error.response.status === 409) {
          // empty email field.
          Alert.alert('Login Failed', 'Invalid email or password! Please try again.');
        }
        else {
          // Other server errors
          Alert.alert('Server Error', `Server responded with an error: ${error.response.data}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Network Error', 'No response received from the server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert('Request Error', `Error setting up the request: ${error.message}`);
      }
    }
  };
  
  // Function to handle navigation to the sign-up screen
  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };
  // Function to handle navigation to the forgot password screen
  const handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
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
      <View style={styles.additionalOptionsContainer}>
        <TouchableOpacity onPress={handleSignUpPress}>
          <Text style={styles.additionalOptionText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPasswordPress}>
          <Text style={styles.additionalOptionText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSubmit} style={styles.signInButton}>
        <Text style={styles.buttonText}>Sign In</Text>
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
  additionalOptionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  additionalOptionText: {
    fontSize: 14,
    color: '#007BFF',
    marginBottom: 10, // Add margin between the two options
  },
});

export default SignIn;
