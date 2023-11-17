import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  Button,
} from 'react-native';

const teamsData = [
  { id: 1, name: 'TeamA' },
  { id: 2, name: 'TeamB' },
  { id: 3, name: 'TeamC' },
];

const Team = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);            // relavant to selected state of a team, in UI when a team is selected it is highlighted--due to styling
  const [newTeamID, setNewTeamID] = useState('');                    
  const [newTeamName, setNewTeamName] = useState('');
  const [isModal001Visible, setIsModal001Visible] = useState(false); // visible state of modal001
  const [isModal002Visible, setIsModal002Visible] = useState(false); // visible state of modal002   // All modals can be looked up in function toggleModal() and its child functions

  const toggleModal = () => {
    // toddleModal is for purpose of pop-up operational terminal for Create and Join team!
    if (selectedTeam) {
      // If selected it's not able to perform 'Create Team' or 'Join Team' therefore not a change to let the operational terminal pop-up!
      Alert.alert(
        'Error',
        'Please un-select the team before creating or joining a team'
      );
    } else {
      // Now, not a team is selected, then...
      // So far: 
      // toggleModal001() is associated with create team button
      // toggleModal002() is associated with Join Team button
      isModal001Visible ? toggleModal001() : toggleModal002();
    }
  };

  const toggleModal001 = () => {
    // When toggled, set the visibility of model-001
    setIsModal001Visible(!isModal001Visible);
  };

  const toggleModal002 = () => {
    // When toggled, set the visibility of model-002
    setIsModal002Visible(!isModal002Visible);
  };

  const createTeam = () => {
    if (selectedTeam) {
      Alert.alert(
        'Error',
        'Please un-select the team before creating or joining a team'
      );
    } else {
      toggleModal001();
    }
  };

  const joinTeam = () => {
    if (selectedTeam) {
      Alert.alert(
        'Error',
        'Please un-select the team before creating or joining a team'
      );
    } else {
      toggleModal002();
    }
  };

  const selectTeam = (team) => {
    setSelectedTeam(team.id === selectedTeam?.id ? null : team);
  };

  const addNewTeam = () => {
    const id = parseInt(newTeamID);
    const name = newTeamName.trim();
    if (id && name) {
      const newTeam = { id, name };
      teamsData.push(newTeam);
      setSelectedTeam(newTeam);
      toggleModal();
    } else {
      Alert.alert('Error', 'Please enter a valid Team ID and Team Name');
    }
  };

  const deleteTeam = () => {
    if (!selectedTeam) {
      Alert.alert('Error', 'No team is selected!');
    } else {
      const deletedTeam = teamsData.find((team) => team.id === selectedTeam.id);

      const updatedTeams = teamsData.filter(
        (team) => team.id !== selectedTeam.id
      );
      teamsData.length = 0;
      Array.prototype.push.apply(teamsData, updatedTeams);
      setSelectedTeam(null);

      Alert.alert('Delete Team', `Deleted Team: ${deletedTeam.name}, its id: ${deletedTeam.id}`);
      // The line above is waiting to be substituted to real functionality to delete data behind the scene, now it's just a fake pop-up
    }
  };

  const leaveTeam = () => {
    if (!selectedTeam) {
      Alert.alert('Error', 'No team is selected!');
    } else {
      Alert.alert('Leave Team', `Successfully left team: ${selectedTeam.name}, its id: ${selectedTeam.id}`);
      // The line above is waiting to be substituted to real functionality to delete data behind the scene, now it's just a fake pop-up
      setSelectedTeam(null); // but not this line!! This line modify the use state.
    }
  };

  const showTeamDetail = (team) => {
    Alert.alert(
      'Team Detail',
      `${team.name} is selected and team id is ${team.id}`
    );
    // The line above is waiting to be substituted to real functionality to delete data behind the scene, now it's just a fake pop-up
  };

  const joinExistingTeam = () => {
    const id = parseInt(newTeamID);
    const name = newTeamName.trim();

    // Check if the teamID and teamName match an existing team
    const existingTeam = teamsData.find(
      (team) => team.id === id && team.name === name
    );

    if (existingTeam) {
      Alert.alert(
        'Success',
        `Joining team ${existingTeam.name} successfully!`
      );
      // The line above is waiting to be substituted to real functionality to delete data behind the scene, now it's just a fake pop-up
      setSelectedTeam(existingTeam);
      toggleModal002();
    } else {
      Alert.alert(
        'Fail to join',
        'TeamID and TeamName do not match any team in the team list'
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.teamContainer}>
        {teamsData.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={[
              styles.teamItem,
              selectedTeam?.id === team.id && styles.selectedTeam,
            ]}
            onPress={() => selectTeam(team)}
          >
            <Text>{team.name}</Text>
            {selectedTeam?.id === team.id && (
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => showTeamDetail(team)}
              >
                <Text>Detail</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={createTeam}>
            <Text>Create Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={joinTeam}>
            <Text>Join Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: 'crimson' }}
            onPress={deleteTeam}
          >
            <Text>Delete Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: 'crimson' }}
            onPress={leaveTeam}
          >
            <Text>Leave Team</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* The first model which is reponsible for renderring view of Create-Team-Pop-Up window */}
      <Modal visible={isModal001Visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Enter Team ID and Team Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Team ID"
            onChangeText={(text) => setNewTeamID(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Team Name"
            onChangeText={(text) => setNewTeamName(text)}
          />
          <Button title="Add Team" onPress={addNewTeam} />
          <Button title="Cancel" onPress={toggleModal001} />
        </View>
      </Modal>
      {/* The second model which is reponsible for renderring view of Join-Team-Pop-Up window */}
      <Modal visible={isModal002Visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Enter Team ID and Team Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Team ID"
            onChangeText={(text) => setNewTeamID(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Team Name"
            onChangeText={(text) => setNewTeamName(text)}
          />
          <Button title="Join Team" onPress={joinExistingTeam} />
          <Button title="Cancel" onPress={toggleModal002} />
        </View>
      </Modal>
      {/* These several models above, they are always rendered to the team page, but their visibility is controlled bu functions */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  teamContainer: {
    flex: 1,
    padding: 10,
  },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  selectedTeam: {
    backgroundColor: 'lightblue',
  },
  footer: {
    alignItems: 'flex-end',
    padding: 10,
    marginTop: 'auto',
    backgroundColor: 'cyan',
    borderTopWidth: 1,
    borderColor: 'lightgray',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#D3D3D3',
    padding: 5,
    margin: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  detailButton: {
    backgroundColor: 'cyan',
    padding: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
});

export default Team;


