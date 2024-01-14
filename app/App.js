import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, CheckBox } from 'react-native';
import DeviceModal from "./DeviceConnectionModal";
import useBLE from "./useBLE";
import CheckBoxs from '@react-native-community/checkbox';

const App = () => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [top, setTop] = useState("Please connect to a device")
  const {
    requestPermissions,
    score1,
    disconnectFromDevice,
    connectToDevice,
    devices,
    connD1,
    connD2,
    setScore1,
    score2,
    setScore2,
    startScan,
    updateScore
  } = useBLE();
  const handleIncrementTeam1 = () => {
    setScore1(score1 + 1),
    updateScore(score1 + 1, connD1)
  };

  const handleSubmit = () => {
    if (selected.length !== 1) {
      setTop("Please select 1 devices")
    } else {
      connectToDevice(selected[0])

    }
  }

  const handleIncrementTeam2 = () => {
    setScore2(score2 + 1)
    updateScore(score2, connD2)
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log("permissions done")
      startScan();
    }
  };
  
  const handleChange = (val, idx) => {
    if(val) {
      setSelected([...selected, devices[idx]])
    } else {
      arr = selected.filter((item) => {
        return item !== devices[idx]
      })
      setSelected(arr)
    }
  }

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
    console.log(devices)
  };

  return (
    <View style={styles.container}>
      {connD1 ? (<>
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
          <Text style={styles.title}>{top}</Text>
          <TouchableOpacity
            onPress={connD1 ? disconnectFromDevice : openModal}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaButtonText}>
              {connD1 ? "Disconnect" : "Connect"}
            </Text>
          </TouchableOpacity>
          {isModalVisible ? 
          <>
            {devices.map((dev, idx) => (
              <View key={idx}>  
                <CheckBoxs
                  value={selected.includes(dev)}
                  onValueChange={(val) => handleChange(val, idx)}
                />
                <Text>{dev.name}</Text>
              </View>
            ))}
            <TouchableOpacity 
              onPress={handleSubmit}
            ><Text>Pair</Text></TouchableOpacity>
            </>
          : <Text>Placeholder</Text>}
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