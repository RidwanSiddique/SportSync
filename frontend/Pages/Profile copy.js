// this is profile page jonathan currently working on.
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import userImage from './niceDoge.jpg';
import { FontAwesome } from '@expo/vector-icons';

const Profile = () => {
  const [personalAchievementExpanded, setPersonalAchievementExpanded] = useState(false);
  const [attendanceInfoExpanded, setAttendanceInfoExpanded] = useState(false);
  const [gameStatsExpanded, setGameStatsExpanded] = useState(false);

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

  const navigation = useNavigation(); // Get the navigation prop

  const handleImageChangePortal = () => {
    showAlert('Change the image here');
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.userImageContainer}>
          <Image source={userImage} style={styles.userImage} />
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