import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)

  return (
    <View style={styles.container}>
      <Text>
        THIS IS A PLACEHOLDER
      </Text>
      <View styles={styles.scores}>
        <Text>
          {score1}
        </Text>
        <Text>
          {score2}
        </Text>
      </View>
      <View styles={styles.buttons} >
        <Button
          onPress={() => {setScore1(score1 + 1)}}
          title="Press me1"
        />
        <Button
          onPress={() => {setScore2(score2 + 1)}}
          title="Press me2"
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scores: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
