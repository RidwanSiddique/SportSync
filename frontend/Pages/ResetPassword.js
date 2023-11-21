import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const ResetPassword = ({ route, navigation }) => {
    const { otp } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const resetPassword = async () => {
    try {
        const response = await axios.post('http://localhost:3000/sportSync/resetPassword', {
        otp,
        newPassword,
        confirmNewPassword,
    });

        if (response.data.success) {
        setModalVisible(true);
        } else {
        alert(response.data.message);
        }
    } catch (error) {
        console.error('Password Reset Failed', error);
        alert('Password Reset Failed. Please try again.');
    }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        navigation.navigate('SignIn'); // Replace 'SignIn' with the actual route name for your sign-in page
    };

    return (
        <View style={styles.container}>
        <Text style={styles.heading}>Reset Password</Text>
        <TextInput
            style={styles.input}
            placeholder="New Password"
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry
        />
        <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            onChangeText={(text) => setConfirmNewPassword(text)}
            secureTextEntry
        />
        <TouchableOpacity onPress={resetPassword}>
            <View style={styles.resetButton}>
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
        resetButton: {
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
    resetButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginBottom: 20,
    },
});
    
export default ResetPassword;
