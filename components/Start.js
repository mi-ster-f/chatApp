import React from 'react';
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

// The application’s landing page component that renders the login/registeration UI
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'User', color: '#fff' };
  }

  render() {
    return (
      <ImageBackground
        // Grab the background image asset from the asset dir
        source={require('../assets/BackgroundImage.png')}
        style={styles.backgroundImage}
      >
        <Text
          style={styles.appTitle}
          accessible={true}
          accessibilityLabel="The Chat app"
          accessibilityRole="header"
        >
          The Chat App
        </Text>
        <View
          // Container for the Chat Settings

          style={styles.box}
          accessible={true}
          accessibilityLabel="Settings Container"
          accessibilityRole="Toolbar"
        >
          <View
            // Container to house the avatar icon and the text input
            style={styles.inputContainer}
          >
            {/* <Image
              source={require('../assets/userIcon.png')}
              style={{ height: 25, width: 25, right: 3, top: 7 }}
            /> */}
            <TextInput
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              placeholder="Your Name"
              accessible={true}
              accessibilityLabel="Set Username Input"
              accessibilityHint="Set your Username for the chat"
              // Find proper role for text input
              accessibilityRole="none"
            />
          </View>
          <View style={styles.colorContainer}>
            <Text style={styles.colorOptionText}>Choose Background Color:</Text>
            <View
              style={styles.colorSelector}
              accessible={true}
              accessibilityLabel="Color Selector"
              accessibilityHint="Lets you choose your chat background."
              accessibilityRole="button"
            >
              {this.state.color == '#090C08' ? (
                <TouchableOpacity
                  style={[styles.color1, styles.active]}
                  accessible={true}
                  accessibilityLabel="Color option #090C08"
                  accessibilityHint="Color background option number 1"
                  accessibilityRole="button"
                ></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.colorStyles, styles.color1]}
                  onPress={() =>
                    this.setState({
                      color: '#090C08',
                    })
                  }
                  accessible={true}
                  accessibilityLabel="Color option #090C08"
                  accessibilityHint="Color background option number 1"
                  accessibilityRole="button"
                ></TouchableOpacity>
              )}
              {this.state.color == '#474056' ? (
                <TouchableOpacity
                  style={[styles.color2, styles.active]}
                  accessible={true}
                  accessibilityLabel="Color option #474056"
                  accessibilityHint="Color background option number 2"
                  accessibilityRole="button"
                ></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.colorStyles, styles.color2]}
                  onPress={() =>
                    this.setState({
                      color: '#474056',
                    })
                  }
                  accessible={true}
                  accessibilityLabel="Color option #474056"
                  accessibilityHint="Color background option number 2"
                  accessibilityRole="button"
                ></TouchableOpacity>
              )}
              {this.state.color == '#8A95A5' ? (
                <TouchableOpacity
                  style={[styles.color3, styles.active]}
                  accessible={true}
                  accessibilityLabel="Color option #8A95A5"
                  accessibilityHint="Color background option number 3"
                  accessibilityRole="button"
                ></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.colorStyles, styles.color3]}
                  onPress={() =>
                    this.setState({
                      color: '#8A95A5',
                    })
                  }
                  accessible={true}
                  accessibilityLabel="Color option #8A95A5"
                  accessibilityHint="Color background option number 3"
                  accessibilityRole="button"
                ></TouchableOpacity>
              )}
              {this.state.color == '#B9C6AE' ? (
                <TouchableOpacity
                  style={[styles.color4, styles.active]}
                  accessible={true}
                  accessibilityLabel="Color option #B9C6AE"
                  accessibilityHint="Color background option number 4"
                  accessibilityRole="button"
                ></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.colorStyles, styles.color4]}
                  onPress={() =>
                    this.setState({
                      color: '#B9C6AE',
                    })
                  }
                  accessible={true}
                  accessibilityLabel="Color option #B9C6AE"
                  accessibilityHint="Color background option number 4"
                  accessibilityRole="button"
                ></TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              //
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
              accessible={true}
              accessibilityLabel="Start Chatting button"
              accessibilityHint="Click to Open chat view"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

/*
Styling 
*/

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    height: '44%',
    width: '88%',
    alignSelf: 'center',
    marginBottom: '15%',
    justifyContent: 'space-between',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFF',
    alignSelf: 'center',
    marginTop: '16%',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    alignSelf: 'center',
    paddingLeft: 10,
    fontSize: 16,
    width: '88%',
    fontWeight: '300',
    color: '#757083',
    height: 50,
    opacity: 0.5,
    borderColor: 'gray',
    borderWidth: 2,
  },
  colorContainer: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
    marginVertical: 4,
  },
  colorOptionText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
  },

  colorSelector: {
    flexDirection: 'row',
    marginTop: 4,
    width: '77%',
    justifyContent: 'flex-start',
  },
  colorStyles: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  color1: {
    backgroundColor: '#090C08',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },
  active: {
    borderWidth: 3,

    borderColor: '#e5cb90',
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    width: '88%',
    backgroundColor: '#757083',
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    alignSelf: 'center',
  },
});
