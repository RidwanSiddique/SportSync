    import React, { useState } from 'react';
    import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
    import axios from 'axios';

    const OtpPage = ({ route, navigation }) => {
    const [otp, setOtp] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const verifyOtp = async () => {
        try {
        const response = await axios.post('http://localhost:3000/sportSync/verify', { otp });

        if (response.data.success) {
            setModalVisible(true);
            navigation.navigate('ResetPassword', { otp }); // Pass the OTP to the ResetPassword page
        } else {
            alert(response.data.message);
        }
        } catch (error) {
        console.error('OTP Verification Failed', error);
        alert('OTP Verification Failed. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
        <Text style={styles.heading}>Enter Verification Code</Text>
        <TextInput
            style={styles.input}
            placeholder="Verification Code"
            onChangeText={(text) => setOtp(text)}
        />
        <TouchableOpacity onPress={verifyOtp}>
            <View style={styles.verifyButton}>
            <Text style={styles.buttonText}>Verify</Text>
            </View>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalText}>OTP verification successful!</Text>
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
    verifyButton: {
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

    export default OtpPage;
