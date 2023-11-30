import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Profile = () => {
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [userImageUri, setUserImageUri] = useState(null);
const [profileImage, setProfileImage] = useState(null);
const { user, dispatch } = useContext(AuthContext);
const navigation = useNavigation();
useEffect(() => {
  // Fetch user data when the component mounts
  fetchUserData();
}, []);

const fetchUserData = async () => {
  try {
    // Make a request to fetch user data
    const response = await axios.get(`http://localhost:3000/sportSync/user/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    console.log("User data response:", response.data);
    // Update the state with the fetched user data
    if (response.data.success) {
      // Update the state with the fetched user data
      const userData = response.data;
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setUserImageUri(userData.profileImage);
    } else {
      console.error(`Failed to fetch user data. Server responded with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching user data', error);
  }
};

const handleUploadProfileImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });
    if (!result.canceled) {
       // Make a request to the backend to update the profile image
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfileImage(base64Image);
      const userId = user.userId;
      console.log('image:', base64Image);
      try {
         // set user's profile image to the backend
        const response = await axios.post(`http://localhost:3000/sportSync/user/${userId}/profile-image`, base64Image, {
          headers: {
            'Content-Type': 'text/plain',
            Authorization: `Bearer ${user.token}`,
          },
        });
        
         // If the update is successful, update the user's profile image locally
        if (response.status === 200) {
          setUserImageUri(result.assets[0].uri);
        } else {
          console.error(`Failed to update profile image. Server responded with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error updating profile image', error);
      }
    }
  } catch (error) {
    console.error('Error picking an image', error);
  }
} 
const handleSubmit = async () => {
  // Construct the user's profile data as a JSON object
  const profileData = {
    firstName,
    lastName,
    email,
    profileImage: profileImage ? profileImage : null,
  };

  try {
    // Send a POST request to your server's API endpoint for updating the user profile
    const response = await axios.post(`http://localhost:3000/sportSync/user/updateProfile/${user.userId}`, profileData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });

    // Check the status code of the server's response
    if (response.data.success) {
      // If the status code indicates success, update the user's information in your app's state
      // For example, if you're using React Context for state management:
      // dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
      console.log('Profile updated successfully');
    } else {
      // If the status code indicates an error, display an error message to the user
      console.log('Error in profile:', response.data.message);
    }
  } catch (error) {
    // Handle any errors that occurred when making the request
    console.error('Error updating profile:', error);
  }
};

const logout = async () => {
  
  try {
    // Clear user data from AsyncStorage
    await AsyncStorage.removeItem('user');
    // Dispatch the LOGOUT action to update the global state
    dispatch({ type: 'LOGOUT' });
    // Redirect to the login page or any other desired route after successful logout
    navigation.navigate('SignIn'); // Replace 'Login' with the name of your login screen
  } catch (error) {
    console.error('Logout error:', error);
  }
};
return (
  <View style={styles.container}>
    <View style={styles.userImageContainer}>
      <Image source={{ uri: userImageUri }} 
      defaultSource={require('./image.png')} 
      style={styles.userImage} />
      <TouchableOpacity onPress={handleUploadProfileImage} style={styles.changeImageIcon}>
        <FontAwesome name="exchange" size={24} color="black" />
      </TouchableOpacity>
    </View>

    {/* Display user information */}
    <Text style={styles.inputLabel}>First Name</Text>
    <TextInput
      style={styles.input}
      placeholder="First Name"
      value={firstName}
      onChangeText={setFirstName}
    />

    <Text style={styles.inputLabel}>Last Name</Text>
    <TextInput
      style={styles.input}
      placeholder="Last Name"
      value={lastName}
      onChangeText={setLastName}
    />

    <Text style={styles.inputLabel}>Email</Text>
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
    />

    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
      <Text style={styles.buttonText}>Update Profile</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={logout}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  userImageContainer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  userImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  changeImageIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  userInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left', // Align the input labels to the left
    alignSelf: 'flex-start', // Align the input labels to the left within their container
  },
});

export default Profile;