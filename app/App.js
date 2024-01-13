import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const App = () => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const handleIncrementTeam1 = () => {
    setTeam1Score(team1Score + 1);
  };

  const handleIncrementTeam2 = () => {
    setTeam2Score(team2Score + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scoreboard</Text>

      <View style={styles.scoreContainer}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamTitle}>Team 1</Text>
          <Text style={styles.score}>{team1Score}</Text>
          <TouchableOpacity onPress={handleIncrementTeam1}>
            <Text style={styles.button}>Increment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.teamTitle}>Team 2</Text>
          <Text style={styles.score}>{team2Score}</Text>
          <TouchableOpacity onPress={handleIncrementTeam2}>
            <Text style={styles.button}>Increment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%',
  },
  teamContainer: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 4,
    margin: 5,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    color: 'blue',
  },
});

export default App;