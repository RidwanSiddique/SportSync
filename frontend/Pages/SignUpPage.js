import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { dispatch } = useContext(AuthContext);

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/sportSync/register', {
        firstName,
        lastName,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.message === 'passed') {
        // Registration successful, dispatch LOGIN action
        dispatch({ type: 'LOGIN', payload: { token: response.data.token } });

        Alert.alert('Registration Successful','Please Sign In now!');
        // Navigate to a different screen (e.g., Home)
        navigation.navigate('SignIn');
      } else {
        // registration failed, show an error message
        Alert.alert('Login Failed', 'Please try again.');
      }
    } catch (error) {
      // Handle specific errors and show appropriate alerts
      if (error.response) {
        if (error.response.status === 401) {
          // Unauthorized (wrong email or password)
          Alert.alert('Sign Up Failed', 'Email already exists. Please Sign In!');

          navigation.navigate('SignIn');
        } 
        else if (error.response.status === 400) {
          // empty email and password field.
          Alert.alert('Sign Up Failed', 'All Fields must be filled!');
        }
        else if (error.response.status === 405) {
          // empty password field.
          Alert.alert('Sign Up Failed', 'Must enter a password!');
        }
        else if (error.response.status === 406) {
          // empty email field.
          Alert.alert('Sign Up Failed', 'Must enter an email!');
        }
        else if (error.response.status === 407) {
          // empty email field.
          Alert.alert('Sign Up Failed', 'Invalid email! Please enter a valid email.');
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
  
      console.error('Error:', error);
    }
  };


  const handleSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const handleSubmit = () => {
    // You can add form validation logic here if needed
    console.log({
      firstName,
      lastName,
      email,
      password,
    });

    // Call your signUp function here
    handleSignUp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.signInText} onPress={handleSignInPress}>
        Already have an account? Sign In
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signInText: {
    marginTop: 16,
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default SignUp;