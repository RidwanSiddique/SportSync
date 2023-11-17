import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import niceDogeImage from './image.png';

const Profile = () => {
  const [personalAchievementExpanded, setPersonalAchievementExpanded] = useState(false);
  const [attendanceInfoExpanded, setAttendanceInfoExpanded] = useState(false);
  const [gameStatsExpanded, setGameStatsExpanded] = useState(false);
  const [userImageUri, setUserImageUri] = useState(null);
  const [imagePickerRequested, setImagePickerRequested] = useState(false);

  const togglePersonalAchievement = () => {
    setPersonalAchievementExpanded(!personalAchievementExpanded);
  };

  const toggleAttendanceInfo = () => {
    setAttendanceInfoExpanded(!attendanceInfoExpanded);
  };

  const toggleGameStats = () => {
    setGameStatsExpanded(!gameStatsExpanded);
  };

  const showAlert = (message) => {
    Alert.alert('Popup', message);
  };

  const navigation = useNavigation();

  const handleImageChangePortal = async () => {
    if (!imagePickerRequested) {
      // Request permission to access the camera roll only if not requested before
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showAlert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
        setImagePickerRequested(true);
      } catch (error) {
        console.error('Error requesting camera roll permissions', error);
        return;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setUserImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking an image', error);
    }
  };

  useEffect(() => {
    // Request permission to access the camera roll
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.userImageContainer}>
          <Image source={userImageUri ? { uri: userImageUri } : niceDogeImage} style={styles.userImage} />
          <TouchableOpacity onPress={handleImageChangePortal} style={styles.changeImageIcon}>
            <FontAwesome name="exchange" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.expandableSection}>
          <ExpandableSection
            label="Personal Achievement"
            expanded={personalAchievementExpanded}
            onToggle={togglePersonalAchievement}
          >
            {personalAchievementExpanded && generatePersonalAchievementContent()}
          </ExpandableSection>
        </View>
        <View style={styles.expandableSection}>
          <ExpandableSection
            label="Attendance Information"
            expanded={attendanceInfoExpanded}
            onToggle={toggleAttendanceInfo}
          >
            {attendanceInfoExpanded && generateAttendanceInfoContent()}
          </ExpandableSection>
        </View>
        <View style={styles.expandableSection}>
          <ExpandableSection
            label="Game Stats"
            expanded={gameStatsExpanded}
            onToggle={toggleGameStats}
          >
            {gameStatsExpanded && generateGameStatsContent()}
          </ExpandableSection>
        </View>
      </View>
    </ScrollView>
  );
};

const ExpandableSection = ({ label, expanded, onToggle, children }) => {
  return (
    <View style={styles.expandableSectionContainer}>
      <TouchableOpacity onPress={onToggle} style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{label}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

function generatePersonalAchievementContent() {
  return (
    <>
      <Text>Content related to personal achievements goes here.</Text>
      <Text>Functionality, where are you?</Text>
    </>
  );
}

function generateAttendanceInfoContent() {
  return (
    <>
      <Text>Content related to attendance information goes here.</Text>
      <Text>Functionality, where are you?</Text>
    </>
  );
}

function generateGameStatsContent() {
  return (
    <>
      <Text>Content related to game stats goes here.</Text>
      <Text>Functionality, where are you?</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userImageContainer: {
    alignItems: 'center',
  },
  userImage: {
    width: 200,
    height: 200,
  },
  changeImageIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  expandableSectionContainer: {
    backgroundColor: 'cyan',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
  },
  expandableSection: {
    padding: 10,
  },
  sectionHeader: {
    padding: 10,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionContent: {
    padding: 10,
  },
});

export default Profile;




