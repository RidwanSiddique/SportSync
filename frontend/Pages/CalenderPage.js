import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Platform,
  Button,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import RNModal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'

const window = Dimensions.get('window');

const CalenderPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [matchName, setMatchName] = useState('');
  // where all the teams are stored 
  const [teams, setTeams] = useState([]);
  const [yourTeam, setYourTeam] = useState(null);
  const [enemyTeam, setEnemyTeam] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showUpcomingMatches, setShowUpcomingMatches] = useState(true);
  // where the matches are all stored, use effect
  const [data, setData] = useState({});
 // The IP of your local machine	
  const IP = '10.237.214.56';

  /*const removeMatch = (date, matchIndex) => {
    setData((prevData) => {
      const newData = { ...prevData };
  
      if (newData[date] && newData[date].length > matchIndex) {
        newData[date] = newData[date].filter((_, index) => index !== matchIndex);
      }
  
      return newData;
    });
  };
  <TouchableOpacity onPress={() => removeMatch(date, index)}>
          <Text style={{ color: 'red' }}>Remove Match</Text>
        </TouchableOpacity>
  */

 /* function to fetch the data from the database */
 async function fetchMatch() {
	try {
		const response = await fetch(`http://${IP}:3000/sportSync/ShowGames`);
		if(!response.ok) {
			throw new Error(`Network response was not ok: ${response.status}`);
		}
		const fetchedData = await response.json();
		console.log(fetchedData);
		const formattedData = {};
		
		// Group the fetched data by date ("YYYY-MM-DD" format)
		fetchedData.forEach(match => {
			const matchDate = match.date;
			console.log(match.date)

			if(!formattedData[matchDate]){
				formattedData[matchDate] = [];
			}

			// formatting the match object
			const formattedMatch = {
				name: match.name,
				team1: match.team1,
				team2: match.team2,
				time: match.time
			};
			// sorting by match date
			formattedData[matchDate].push(formattedMatch);
		});

		// Update the array with database matches
		setData(prevData => ({ ...prevData, ...formattedData})); // nice way to append
		// setData(formattedData);
	} catch (error) {
		console.error("Error fetching data: ", error);
	}
 };

 async  function fetchTeams() {
	try{
		const response = await fetch(`http://${IP}:3000/sportSync/showTeams`);
		if(!response.ok) {
			throw new Error(`Network response was not ok: ${response.status}`);
		}
		//getting it into the proper format
		const data = await response.json();
		console.log(data);
		setTeams(data);
	} catch(error) {
		console.error('Error fetching teams: ', error);
	}
 };

 // fetch data on a page load
 useEffect(() => { 
	 fetchMatch();
	 fetchTeams(); 
 }, []); // empty array to ensure it only rans once per page load;
  

  const renderItem = (item, date, index) => {
    return (
      <View style={styles.item}>
        <Text>Match Name: {item.name}</Text>
        <Text>Your Team: {item.team1}</Text>
	<Text>Team against: {item.team2} </Text>   
        <Text>Time: {item.time}</Text>
      </View>
    );
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate.nativeEvent.timestamp;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(new Date(currentDate));
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
    setShowTimePicker(false);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
    setShowDatePicker(false);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    setSelectedDate(selectedTime || new Date());
  };

   // where you create a new match 	
  const scheduleMatch = async () => {
    setModalVisible(false);

     const newMatch = {
      name: matchName,
      team1: yourTeam,
      team2: enemyTeam, 
      date: selectedDate.toISOString().split('T')[0],
      time: selectedDate.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
    };
    
    try{
	const response = await axios.post(`http://${IP}:3000/sportSync/CreateGame`, newMatch, {
		headers: {'Content-Type': 'application/json'}}); 
	    if(response.status !== 200){
		console.log("response not ok");
	    }
    } catch(error){
	console.error('Error scheduling match', error);
	throw error; 
    }
    
    console.log(data); 	  
    const dateString = selectedDate.toISOString().split('T')[0];

    setData((prevData) => {
      const newData = { ...prevData };
 
      // conditionally for how the data will be inputted. 
      if (newData[dateString]) {
        newData[dateString].push(newMatch);
      } else {
        newData[dateString] = [newMatch];
      }

      return newData;
    });

  };

 /* making an array of formatted teams */ 
  const teamItems = teams.map((team) => ({
	label: team.TeamName,
	value: team.TeamName
  }));
 

  const renderDateTimePicker = () => {
    if (showDatePicker || showTimePicker) {
      return (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode={showDatePicker ? 'date' : 'time'}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={showDatePicker ? onChangeDate : onChangeTime}
        />
      );
    }
    return null;
  };

  const filterData = () => {
    const currentDate = new Date();
    const filteredData = {};

    for (const date in data) {
      const matches = data[date];
      const isUpcoming = new Date(date) >= currentDate;

      if ((showUpcomingMatches && isUpcoming) || (!showUpcomingMatches && !isUpcoming)) {
        filteredData[date] = matches;
      }
    }

    return filteredData;
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, showUpcomingMatches && styles.activeButton]}
          onPress={() => setShowUpcomingMatches(true)}
        >
          <Text style={styles.buttonText}>Upcoming Matches</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !showUpcomingMatches && styles.activeButton]}
          onPress={() => setShowUpcomingMatches(false)}
        >
          <Text style={styles.buttonText}>Past Matches</Text>
        </TouchableOpacity>
      </View>

      <Agenda
        items={filterData()}
        renderItem={(item, date, index) => renderItem(item, date, index)}
        rowHasChanged={(r1, r2) => r1.name !== r2.name}
        renderEmptyDate={() => <View style={styles.emptyDate} />}
        theme={{
          agendaDayTextColor: 'orange',
          agendaDayNumColor: 'green',
          agendaTodayColor: 'red',
          agendaKnobColor: 'blue',
        }}
        style={{ height: window.height - 200 }}
      />

      <TouchableOpacity onPress={toggleModal} style={styles.scheduleButton}>
        <Text style={styles.buttonText}>Schedule Match</Text>
      </TouchableOpacity>

      <RNModal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Schedule a Match</Text>
          <TextInput
            style={styles.input}
            placeholder="Match Name"
            value={matchName}
            onChangeText={(text) => setMatchName(text)}
          />
          <RNPickerSelect
            placeholder={{ label: 'Select Your Team', value: null }}
	    items={teamItems}
            value={yourTeam}
            onValueChange={(value) => setYourTeam(value)}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
            }}
          />
	  <RNPickerSelect
            placeholder={{ label: 'Select enemy Team', value: null }}
	    items={teamItems}
            value={enemyTeam}
            onValueChange={(value) => setEnemyTeam(value)}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
            }}
          />

          <TouchableOpacity style={styles.input} onPress={showDatepicker}>
            <Text>{selectedDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.input} onPress={showTimepicker}>
            <Text>{selectedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          <Button title="Schedule" onPress={scheduleMatch} />
          <Button title="Cancel" onPress={toggleModal} />
          {renderDateTimePicker()}
        </View>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  scheduleButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'center',
  },
});

export default CalenderPage;
