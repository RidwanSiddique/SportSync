import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 250,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 15,
  },
});

const ForgotPasswordScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const forgotPasswordAPI = (username, email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const handleForgotPassword = async () => {
    if (!username || !email) {
      alert('Please enter both username and email.');
      return;
    }

    try {
      await forgotPasswordAPI(username, email);
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
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
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
              style={styles.modalButton} // Apply the new style to the modal button
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ForgotPasswordScreen;
