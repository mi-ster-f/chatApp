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
    this.state = { name: '', color: '#fff' };
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/BackgroundImage.png')}
        style={styles.backgroundImage}
      >
        <Text style={styles.appTitle}>The Chat App</Text>
        <KeyboardAvoidingView style={styles.box}>
          <View style={styles.inputContainer}>
            {/* <Image
              source={require('../assets/userIcon.png')}
              style={{ height: 25, width: 25, right: 3, top: 7 }}
            /> */}
            <TextInput
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              placeholder="Your Name"
            />
          </View>
          <View style={styles.colorContainer}>
            <Text style={styles.colorOptionText}>Choose Background Color:</Text>
            <View style={styles.colorSelector}>
              {this.state.color == '#090C08' ? (
                <TouchableOpacity
                  style={[styles.color1, styles.active]}
                ></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.colorStyles, styles.color1]}
                  onPress={() =>
                    this.setState({
                      color: '#090C08',
                    })
                  }
                ></TouchableOpacity>
              )}
              {this.state.color == '#474056' ? (
                <TouchableOpacity
                  style={[styles.color2, styles.active]}
                ></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.colorStyles, styles.color2]}
                  onPress={() =>
                    this.setState({
                      color: '#474056',
                    })
                  }
                ></TouchableOpacity>
              )}
              {this.state.color == '#8A95A5' ? (
                <TouchableOpacity
                  style={[styles.color3, styles.active]}
                ></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.colorStyles, styles.color3]}
                  onPress={() =>
                    this.setState({
                      color: '#8A95A5',
                    })
                  }
                ></TouchableOpacity>
              )}
              {this.state.color == '#B9C6AE' ? (
                <TouchableOpacity
                  style={[styles.color4, styles.active]}
                ></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.colorStyles, styles.color4]}
                  onPress={() =>
                    this.setState({
                      color: '#B9C6AE',
                    })
                  }
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
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    // borderColor: 'blue',
    // borderWidth: 2,
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
    // borderColor: 'red',
    // borderWidth: 2,
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
    borderWidth: 1,

    borderColor: '#e5cb90',
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  buttonContainer: {
    flex: 1,
    // borderColor: 'green',
    // borderWidth: 2,
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
