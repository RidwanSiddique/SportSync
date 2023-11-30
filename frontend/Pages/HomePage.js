// HomePage.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Home = () => {
  const [selectedTeam, setSelectedTeam] = useState('Your Team');
  const [userHome, setUserHome] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user.userId) {
          console.log('User state or user ID is undefined. Redirecting to SignIn.');
          navigation.navigate('SignIn');
          return;
        }

        // Fetch user home data
        const userHomeResponse = await axios.get(`http://localhost:3000/sportSync/home/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log("User Home response:", userHomeResponse.data); // Access data directly
        console.log("TeamId:", userHomeResponse.data.teamId); // Log teamId
        console.log("TeamName:", userHomeResponse.data.teamId?.TeamName); // Log TeamName 
        if (userHomeResponse.data.success) {
          setUserHome(userHomeResponse.data);
        } else {
          console.log('Error fetching user home data');
        }

        // Fetch games data
        const gamesResponse = await axios.get(`http://localhost:3000/sportSync/ShowGames`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log("Games response:", gamesResponse.data); // Access data directly
        // Check the HTTP status code for success (status codes in the range of 200-299)
        if (gamesResponse.status >= 200 && gamesResponse.status < 300) {
          // Assuming a successful response, access individual games or perform other actions
          setGames(gamesResponse.data);
        } else {
          console.log('Error in games data:', gamesResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching games data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!user || !user.userId) {
      console.log('User not authenticated');
      navigation.navigate('SignIn');
    } else {
      fetchData();
    }
  }, [selectedTeam, navigation, user, dispatch]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  console.log('Games:', games);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
            {/* Replace with the actual team logo source */}
            <Text style={styles.welcomeMessage}>Welcome, {userHome?.playerName || 'Guest'}!</Text>
            <Text style={styles.teamName}>{userHome?.teamId?.TeamName}</Text>
          </View>

      {/* Display Team Stats Summary */}
      <View style={styles.container}>
      <Text style={styles.sectionTitle}>Team Stats Summary (W/L/T):</Text>
      <View style={styles.card}>
            <Text style={styles.statsText}>{`Wins: ${userHome?.teamStats?.wins || 0}, Losses: ${userHome?.teamStats?.losses || 0}, Ties: ${userHome?.teamStats?.ties || 0}`}</Text>
          </View>
          </View>
      {games.length > 0 ? (
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Games:</Text>
          {games.map((game) => (
            <View key={game._id} style={styles.card}>
              
              <Text>{game.name}</Text>
              <Text>Date: {game.date}</Text>
              <Text>Time: {game.time}</Text>
              <Text>Teams: {game.team1} vs {game.team2}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noGamesContainer}>
          <Text>No games available.</Text>
        </View>
      )}
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
  statsText: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
  gamesContainer: {
    marginBottom: 20,
  },
  gameCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});



export default Home;