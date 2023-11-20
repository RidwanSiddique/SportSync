import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import axios from 'axios'; // Import axios for making HTTP requests

const styles = StyleSheet.create({
  // Your existing styles
});

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
    navigation.navigate('SignIn'); // Replace 'SignIn' with the actual route name for your sign-in page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.forgotPasswordText}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TouchableOpacity onPress={handleForgotPassword}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Password reset successful!</Text>
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

export default ForgotPasswordScreen;
