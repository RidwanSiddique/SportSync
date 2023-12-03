
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import Config from 'react-native-config';
import axios from 'axios';
import { AuthContext } from '../context/authContext';



const IP = process.env.EXPO_PUBLIC_IP;
// const IP = 'localhost';

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isJoinVisible, setisJoinVisible] = useState(false);
  const [isCreateVisible, setisCreateVisible] = useState(false);
  const { user, dispatch } = useContext(AuthContext)

  var coachId = user.userId;
  useEffect(() => {
    fetchTeams();
  }, []);
  
  //fetches all teams that are related to the userId
  const fetchTeams = async () => {
    console.log("Fetching");
    try {
      const response = await axios.get(`http://${IP}:3000/sportSync/getUserTeams`, {
        params: {
          userId: coachId,
        },
      });
  // if the resonse is not ok, then display the error message    
  
      if (response.status !== 200) {
        Alert.alert(response.data.message);
      } else {
        const receivedTeams = response.data;
        console.log(receivedTeams);
  //makes sure that there is a teams in the response and that it is greater than one
        if (receivedTeams.hasOwnProperty('teams') && receivedTeams.teams.length > 0) {
          setTeams(receivedTeams.teams);
          console.log(teams);
        }
        else{
          setTeams([]);
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
//toggles the createTeam window
  const createTeam = () => {
    if (selectedTeam) {
      Alert.alert('Error', 'Please un-select the team before creating or joining a team');
    } else {
      toggleModal();
      setisCreateVisible(true);
    }
  };
//toggles the joinTeam window
  const joinTeam = () => {
    if (selectedTeam) {
      Alert.alert('Error', 'Please un-select the team before creating or joining a team');
    } else {
      toggleModal();
      setisJoinVisible(true);
    }
  };

  // sends to the server that the user wants to join a given team 
  const joiningTeam = async () => {
    const TeamName = newTeamName.trim();
    if (coachId && TeamName) {
      const userId = coachId;
      try {
        const response = await axios.post(`http://${IP}:3000/sportSync/addToTeam`, {
          userId,
          TeamName,
        });
  
        if (response.status !== 200) {
          Alert.alert(response.data.message);
          return;
        }
  
        await fetchTeams();
        joinTeam(); 
      } catch (error) {
        console.error('Error joining team:', error);
        Alert.alert('Error', 'Failed to join team.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid Team ID and Team Name');
    }
  };
  
  //this creates team and adds it to the database
  const addNewTeam = async () => {
    const TeamName = newTeamName.trim();
  
    if (coachId && TeamName) {

      try {
        const createResponse = await axios.post(`http://${IP}:3000/sportSync/teamCreate`, {
          coachId,
          TeamName,
        });
  
        if (createResponse.status !== 200) {
          Alert.alert(createResponse.data.message);
          return;

        }
  
        await fetchTeams();
        createTeam();
      } catch (error) {
        console.error('Error creating team:', error);
        Alert.alert('Error', 'Failed to create team.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid Team ID and Team Name');
    }
  
   
  };
  // deletes the Team from the database and updates the array 
  const deleteTeam = async () => {
    if (!selectedTeam) {
      Alert.alert('Error', 'No team is selected!');
    } else {

      try {
        const TeamName = selectedTeam.TeamName;
  
        if (coachId && TeamName) {
          const response = await axios.post(`http://${IP}:3000/sportSync/teamDelete`, {

            coachId,
            TeamName,
          });
  
          if (response.status !== 200) {
            Alert.alert(response.data.message);
            return;
          }
  
          // Fetch teams after deleting the team
          await fetchTeams();
        } else {
          Alert.alert('Error', 'Please enter a valid Team Name');
          return;
        }
  
        const updatedTeams = teams.filter((team) => team._id !== selectedTeam._id);
        teams.length = 0;
        Array.prototype.push.apply(teams, updatedTeams);
        setSelectedTeam(null);
        Alert.alert('Delete Team', `Deleted Team: ${selectedTeam.TeamName}`);
      } catch (error) {
        console.error('Error deleting team:', error);
        Alert.alert('Error', 'Failed to delete team.');
      }
    }
  };
  

  // user leaves the given team if they are on it
  const leaveTeam = async () => {
    if (!selectedTeam) {
      Alert.alert('Error', 'No team is selected!');
    } else {
      try {
        const TeamName = selectedTeam.TeamName;
  
        if (coachId && TeamName) {
          // Remove from team
          const response = await axios.post(`http://${IP}:3000/sportSync/removeFromTeam`, {
            userId: coachId,
            TeamName,
          });
  
          if (response.status !== 200) {
            Alert.alert(response.data.message);
            return;
          }
  
          await fetchTeams();
        } else {
          const updatedTeams = teams.filter((team) => team._id !== selectedTeam._id);
          teams.length = 0;
          Array.prototype.push.apply(teams, updatedTeams);
          setSelectedTeam(null);
          Alert.alert('Leave Team', `Left Team: ${selectedTeam.TeamName}`);
          await fetchTeams();
        }
      } catch (error) {
        console.error('Error leaving team:', error);
        Alert.alert('Error', 'Failed to leave team.');
      }
    }
  };
  
// hows the details of the teams, I dont know if this works or not 
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
          <TouchableOpacity style={styles.button} onPress={createTeam}>
            <Text>Create Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={joinTeam}>
            <Text>Join Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button}} onPress={deleteTeam}>
            <Text>Delete Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.button}} onPress={leaveTeam}>
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
    backgroundColor: '#007BFF',
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
