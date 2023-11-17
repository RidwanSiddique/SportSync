import React, { useState } from 'react';
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
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showUpcomingMatches, setShowUpcomingMatches] = useState(true);
  // where the matches are all stored, use effect
  const [data, setData] = useState({
    '2023-11-15': [{ name: 'Upcoming Match 1', team: 'Team A', time: '12:00 PM' }],
    '2023-11-16': [{ name: 'Upcoming Match 2', team: 'Team B', time: '3:30 PM' }],
    '2023-11-10': [{ name: 'Past Match 1', team: 'Team C', time: '5:00 PM' }],
    '2023-11-11': [{ name: 'Past Match 2', team: 'Team D', time: '10:45 AM' }],
  });

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
  

  const renderItem = (item, date, index) => {
    return (
      <View style={styles.item}>
        <Text>Match Name: {item.name}</Text>
        <Text>Team: {item.team}</Text>
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
      team: selectedTeam,
      time: selectedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    
    try{
	const response = await axios.post('http://172.16.1.177:3000/sportSync/CreateGame', newMatch, {
		headers: {'Content-Type': 'application/json'}});

	    if(response.status !== 200){
		console.log("response not ok");
	    }
    } catch(error){
	console.error('Error scheduling match', error);
	throw error; 
    }	   
   
    /* the fetch method works for the web	   
    try{
	const response = await fetch('http://localhost:3000/sportSync/CreateGame', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			name: matchName,
			team: selectedTeam,
			time: selectedDate.toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit'})
		})
	   });

	    if(!response.ok){
		console.log("response not ok");
	    }
    } catch(error){
		console.error('Error scheduling match', error);
	    	throw error; 
    }

    */ 

   /* no longer using newData structure	  
    const newMatch = {
      name: matchName,
      team: selectedTeam,
      time: selectedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    
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
	  */
  };

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
            placeholder={{ label: 'Select Team', value: null }}
            items={[
              { label: 'Team A', value: 'Team A' },
              { label: 'Team B', value: 'Team B' },
              // Add more teams as needed, supply using the database
            ]}
            value={selectedTeam}
            onValueChange={(value) => setSelectedTeam(value)}
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
