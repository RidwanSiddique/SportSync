import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image } from 'react-native';

// Simulated user data
const fakeUserId = 'fakeUserId123';

// Sample data
const upcomingGamesData = [
  { id: 1, team: 'Team A', date: '2023-11-15' },
  { id: 2, team: 'Team B', date: '2023-11-20' },
  { id: 3, team: 'Team C', date: '2023-11-25' },
];

const previousGamesData = [
  { id: 1, team: 'Team X', result: 'W' },
  { id: 2, team: 'Team Y', result: 'L' },
  { id: 3, team: 'Team Z', result: 'T' },
];

const teamStats = { wins: 5, losses: 3, ties: 2 };

const generateDummyText = (length) => {
  return Array.from({ length }, (_, index) => `Dummy Text ${index + 1}`).join(' ');
};

const Home = ({ navigation }) => {
  const [selectedTeam, setSelectedTeam] = useState('Your Team');
  const [lastStats, setLastStats] = useState(null);
  const [userHome, setUserHome] = useState(null);

  useEffect(() => {
    const fetchUserHome = async () => {
      try {
        // Simulating data fetching by using a fake user ID
        // In a real app, you would replace this with an actual API call
        const response = await fetch(`http://172.16.1.177:3000/sportSync/home/${fakeUserId}`);
        const data = await response.json();

        if (data.success) {
          setUserHome(data.user);
        } else {
          console.log(data.message);
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserHome();

    const fetchLastStats = (team) => {
      return { goals: 10, assists: 5, possession: '60%' };
    };

    const stats = fetchLastStats(selectedTeam);
    setLastStats(stats);
  }, [selectedTeam, navigation]);

  // Replace with actual team logo image source
  const teamLogoSource = require('./image.png');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={teamLogoSource} style={styles.teamLogo} />
        <Text style={styles.welcomeMessage}>Welcome, {userHome?.playerName}!</Text>
        <Text style={styles.teamName}>{userHome?.teamName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Upcoming Games:</Text>
        {upcomingGamesData.map((game) => (
          <Text key={game.id} style={styles.gameItem}>{`${game.team} - ${game.date}`}</Text>
        ))}
        <Text>{generateDummyText(20)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Previous Games:</Text>
        {previousGamesData.map((game) => (
          <Text key={game.id} style={styles.gameItem}>{`${game.team} - Result: ${game.result}`}</Text>
        ))}
        <Text>{generateDummyText(20)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Last Stats Against {selectedTeam}:</Text>
        {lastStats ? (
          <Text style={styles.statsText}>{`Goals: ${lastStats.goals}, Assists: ${lastStats.assists}, Possession: ${lastStats.possession}`}</Text>
        ) : (
          <Text style={styles.noStatsText}>No stats available</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Team Stats Summary (W/L/T):</Text>
        <Text style={styles.statsText}>{`Wins: ${teamStats.wins}, Losses: ${teamStats.losses}, Ties: ${teamStats.ties}`}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Change Team"
          onPress={() => {
            setSelectedTeam(selectedTeam === 'Your Team' ? 'Opponent Team' : 'Your Team');
          }}
        />
      </View>

      <View style={styles.navigationContainer}>
        <Button style={styles.navigationButton} title="Feature 1" onPress={() => console.log('Navigate to Feature 1')} />
        <Button style={styles.navigationButton} title="Feature 2" onPress={() => console.log('Navigate to Feature 2')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background color
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  teamLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 50, // Rounded corners for the team logo
    marginBottom: 10,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Darker text color
    textAlign: 'center',
  },
  teamName: {
    fontSize: 18,
    color: '#555', // Slightly darker text color
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff', // White background for cards
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Add elevation for Android shadow effect
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  gameItem: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
  statsText: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
  noStatsText: {
    fontSize: 18,
    color: '#f00',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  navigationContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navigationButton: {
    width: '45%',
    backgroundColor: '#4CAF50', // Green background color
    padding: 10,
    borderRadius: 5,
  },
});


export default Home;
