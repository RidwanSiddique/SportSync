import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
        // Navigate to a different screen (e.g., Home)
        navigation.navigate('MainNavigator');
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Error during sign-up:', error.message);
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