import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import axios from 'axios'; // Import axios for making HTTP requests

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const forgotPasswordAPI = (email) => {
    // Make a POST request to the forgotPassword API endpoint
    return axios.post('http://localhost:3000/sportSync/forgotPassword', { email })
      .then(response => {
        // Return a Promise that resolves when the OTP is sent successfully
        return Promise.resolve(response.data);
      })
      .catch(error => {
        // Return a Promise that rejects with the error
        return Promise.reject(error);
      });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    try {
      // Call the forgotPasswordAPI function with the provided email
      const result = await forgotPasswordAPI(email);

      // If the OTP is sent successfully, display the modal
      setModalVisible(true);
    } catch (error) {
      console.error('Forgot Password Failed', error);
      alert('Forgot Password Failed. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Add navigation logic here to go back to the sign-in page
    navigation.navigate('OtpPage'); // Replace 'SignIn' with the actual route name for your sign-in page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TouchableOpacity onPress={handleForgotPassword}>
        <View style={styles.signInButton}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Verification Code Sent!</Text>
            <Button
              title="OK"
              onPress={handleCloseModal}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
  },
});
export default ForgotPasswordScreen;