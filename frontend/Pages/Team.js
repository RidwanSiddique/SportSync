
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal, Button } from 'react-native';
import axios from 'axios';
const Team = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  // const [newTeamID, setNewTeamID] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isJoinVisible, setisJoinVisible] = useState(false);
  const [isCreateVisible, setisCreateVisible] = useState(false);


  var coachId = '6544586e906e3e00fa50bdbb';
  useEffect(() => {
    fetchTeams();
  }, []);
  
  const fetchTeams = async () => {
    try {
      coachId = '6544586e906e3e00fa50bdbb';
      const response = await axios.get('http://localhost:3000/sportSync/getUserTeams', {
        params: {
          userId: coachId,
        },
      });
  
      if (response.status !== 200) {
        Alert.alert(response.data.message);
      } else {
        const receivedTeams = response.data;
        console.log(receivedTeams);
  
        // Check if the response has the "teams" property
        if (receivedTeams.hasOwnProperty('teams') && receivedTeams.teams.length > 0) {
          setTeams(receivedTeams.teams);
          console.log(teams);
        }
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };
  
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const selectTeam = (team) => {
    setSelectedTeam(selectedTeam?._id === team._id ? null : team);
  };
  const createTeam = () => {
    if (selectedTeam) {
      Alert.alert('Error', 'Please un-select the team before creating or joining a team');
    } else {
      toggleModal();
      setisCreateVisible(true);
    }
  };
  const joinTeam = () => {
    if (selectedTeam) {
      Alert.alert('Error', 'Please un-select the team before creating or joining a team');
    } else {
      toggleModal();
      setisJoinVisible(true);
    }
  };
  const joiningTeam = () => {
    const TeamName = newTeamName.trim();
    if (coachId && TeamName) {
      const userId = coachId;
      const fetchTeams = async () => {
        try {
          const response = await axios.post('http://localhost:3000/sportSync/addToTeam', {
            userId,
            TeamName
          });
          if (response.status !== 200) {
            Alert.alert(response.data.message);
          }
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      };
      fetchTeams();
      joinTeam();
    } else {
      Alert.alert('Error', 'Please enter a valid Team ID and Team Name');
    }
  };
  const addNewTeam = () => {
    const TeamName = newTeamName.trim();
    if (coachId && TeamName) {
      const fetchTeams = async () => {
        try {
          const response = await axios.post('http://localhost:3000/sportSync/teamCreate', {
            coachId,
            TeamName
          });
          if (response.status !== 200) {
            Alert.alert(response.data.message);
          }
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      };
      fetchTeams();
      createTeam();
    } else {
      Alert.alert('Error', 'Please enter a valid Team ID and Team Name');
    }
  };
  const deleteTeam = () => {
    if (!selectedTeam) {
      Alert.alert('Error', 'No team is selected!');
    } else {
      const TeamName = selectedTeam.TeamName;
      console.log(TeamName);
      console.log(selectedTeam);
    if (coachId && TeamName) {
      const fetchTeams = async () => {
        try {
          const response = await axios.post('http://localhost:3000/sportSync/teamDelete', {
            coachId,
            TeamName
          });
          if (response.status !== 200) {
            Alert.alert(response.data.message);
          }
        } catch (error) {
          console.error('Error deleting teams:', error);
        }
      };
      fetchTeams();
    } else {
      Alert.alert('Error', 'Please enter a valid Team Name');
    }
      const updatedTeams = teams.filter((team) => team._id !== selectedTeam._id);
      teams.length = 0;
      Array.prototype.push.apply(teams, updatedTeams);
      setSelectedTeam(null);
      Alert.alert('Delete Team', `Deleted Team: ${selectedTeam.name}`);
    }
  };
  const leaveTeam = () => {
    if (!selectedTeam) {
      Alert.alert('Error', 'No team is selected!');
    } else {
      const updatedTeams = teams.filter((team) => team._id !== selectedTeam._id);
      teams.length = 0;
      Array.prototype.push.apply(teams, updatedTeams);
      setSelectedTeam(null);
      Alert.alert('Leave Team', `Left Team: ${selectedTeam.TeamName}`);
    }
  };
  const showTeamDetail = (team) => {
    Alert.alert('Team Detail', `${team.TeamName} is selected, coach is ${team.coachId}`);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.teamContainer}>
        {teams.map((team) => (
          <TouchableOpacity
            key={team._id}
            style={[
              styles.teamItem,
              selectedTeam?._id === team._id && styles.selectedTeam,
            ]}
            onPress={() => selectTeam(team)}
          >
            <Text>{team.TeamName}</Text>
            {selectedTeam?._id === team._id && (
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
          <TouchableOpacity style={styles.button} onPress={fetchTeams}>
            <Text>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={createTeam}>
            <Text>Create Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={joinTeam}>
            <Text>Join Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, backgroundColor: 'crimson' }} onPress={deleteTeam}>
            <Text>Delete Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button, backgroundColor: 'crimson' }} onPress={leaveTeam}>
            <Text>Leave Team</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={isModalVisible} animationType="slide">
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
          <Button
            title="Join Team"
            style={{ display: isJoinVisible ? 'block' : 'none' }}
            onPress={joiningTeam}
          />
          <Button
            title="Create Team"
            style={{ display: isCreateVisible ? 'block' : 'none' }}
            onPress={addNewTeam}
          />
          <Button title="Cancel" onPress={toggleModal} />
        </View>
      </Modal>
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
