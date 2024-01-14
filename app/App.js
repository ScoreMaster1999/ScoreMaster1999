import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DeviceModal from "./DeviceConnectionModal";
import useBLE from "./ble";

const App = () => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    requestPermissions,
    score1,
    disconnectFromDevice,
    connectToDevice,
    devices,
    connectedDevice,
    setScore1,
    score2,
    setScore2
  } = useBLE();
  const handleIncrementTeam1 = () => {
    setScore1(score1 + 1)
    setTeam1Score(team1Score + 1);
  };

  const handleIncrementTeam2 = () => {
    setScore2(score2 + 1)
    setTeam2Score(team1Score + 1);
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };


  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please connect to a device</Text>
      {connectedDevice ? (<>
      <Text style={styles.title}>Scoreboard</Text>

      <View style={styles.scoreContainer}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamTitle}>Team 1</Text>
          <Text style={styles.score}>{score1}</Text>
          <TouchableOpacity onPress={handleIncrementTeam1}>
            <Text style={styles.button}>Increment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.teamTitle}>Team 2</Text>
          <Text style={styles.score}>{score2}</Text>
          <TouchableOpacity onPress={handleIncrementTeam2}>
            <Text style={styles.button}>Increment</Text>
          </TouchableOpacity>
        </View>
      </View>
      </>) :
      (
        <>
          <Text style={styles.title}>Please connect to a device</Text>
          <TouchableOpacity
            onPress={connectedDevice ? disconnectFromDevice : openModal}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaButtonText}>
              {connectedDevice ? "Disconnect" : "Connect"}
            </Text>
          </TouchableOpacity>
          <DeviceModal
            closeModal={hideModal}
            visible={isModalVisible}
            connectToPeripheral={connectToDevice}
            devices={devices}
          />
        </>
        
      )
      }
      
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