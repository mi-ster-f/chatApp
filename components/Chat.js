import React from 'react';
import { View, Text, Platform, Button } from 'react-native';
import {
  GiftedChat,
  Bubble,
  SystemMessage,
  InputToolbar,
} from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { v4 as uuidv4 } from 'uuid';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

// Dealing with yellow banner timeout issue with react-native sdk
// https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Setting a timer']);

// Dealing with yellow banner Animated.event issue with react-native sdk
// https://stackoverflow.com/questions/61014661/animated-usenativedriver-was-not-specified-issue-of-reactnativebase-input
// https://codedaily.io/tutorials/5/Disable-the-Yellow-Box-in-React-Native
YellowBox.ignoreWarnings(['Animated: `useNativeDriver`', 'Animated.event']);

// import firebase
const firebase = require('firebase');
require('firebase/firestore');

// Credentials for connecting App to Firebase db
const firebaseConfig = {
  apiKey: 'AIzaSyAEhunEEpBQ4AnUWRsiBwcW9OAYdqbmEsw',
  authDomain: 'thechatapp-70e0b.firebaseapp.com',
  databaseURL: 'https://thechatapp-70e0b.firebaseio.com',
  projectId: 'thechatapp-70e0b',
  storageBucket: 'thechatapp-70e0b.appspot.com',
  messagingSenderId: '84608277230',
  appId: '1:84608277230:web:54339df014037cf83cb1ff',
  measurementId: 'G-GX4ETXWZ8H',
};

// The application’s main Chat component that renders the chat UI
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          _id: uuidv4(),
          text: this.props.route.params.name + ' has entered the chat!',
          createdAt: new Date(),
          system: true,
        },
      ],
      isConnected: false,
      uid: '',
      user: {
        _id: '',
        name: this.props.route.params.name,
        avatar: '',
      },
    };

    // create a constructor that will initialize the Firestore app and add the config inside it
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // creating a references to messages collection in Firestore db
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  // Mount component with initial state including welcome message from system and user
  async componentDidMount() {
    // Use Netinfo to check if user is online
    NetInfo.addEventListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribeMessages();

      // NetInfo.removeEventListener(this.handleConnectivityChange);
    }
  }

  handleConnectivityChange = (state) => {
    if (state.isConnected) {
      console.log('online');
      this.setState({
        isConnected: true,
      });
      // Checks is user is logged in otherwise authorise users anonymously and listen for auth change events
      this.authUnsubscribe = firebase
        .auth()
        .onAuthStateChanged(async (user) => {
          if (!user) {
            try {
              await firebase.auth().signInAnonymously();
            } catch (err) {
              console.log(err);
            }
          }
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: this.props.route.params.name,
              avatar: '',
            },
          });

          /*
      The onSnapshot method returns an unsubscribe function so all we need to do is save that reference
     and call the function when the component is unmounted.
     */
          // listen for collection changes for chat room
          this.unsubscribeMessages = this.referenceMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
    } else {
      console.log('offline');
      this.setState({
        isConnected: false,
      });
      //load messages from asyncStorage
      this.getMessages();
    }
  };

  // function to get messages from asyncStorage and set as messages state
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  // method that writes chat messages to state messages when onSnapshot() gets fired i.e when collection changes
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString() || '',
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        uid: data.uid,
        image: data.image || '',
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  // Add/save a message to Firestore
  addMessage = () => {
    let message = this.state.messages;
    // handle case where files are sent as message without text
    if (!message[0].text) {
      message[0].text = '';
    }
    this.referenceMessages.add({
      uid: this.state.uid,
      _id: message[0]._id,
      text: message[0].text,
      createdAt: message[0].createdAt,
      user: {
        _id: this.state.user._id,
        name: this.props.route.params.name,
        avatar: this.state.user.avatar,
      },
      image: message[0].image || '',
      location: message[0].location || null,
    });
  };

  // function to save current state of messages to local async storage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (e) {
      console.log(e.message);
    }
  };

  // Function to append new message to the state "messages" in the component
  // We set a default function parameter to avoid the scenario where the param is undefined or null
  onSend(messages = []) {
    // console.log(messages);
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // Add message to database
        this.addMessage();
        // Store message to local async storage
        this.saveMessages();
      }
    );
  }

  // function to wipe all current messages in asyncStorage (for development phase)
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (e) {
      console.log(e.message);
    }
  };

  // function prop for GiftedChat to customise the chat bubble
  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
        }}
      />
    );
  };

  // function prop for styling of system message in messages state
  renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        textStyle={{ color: '#fff', fontWeight: '900' }}
      />
    );
  };

  /* 
  This needs to be a function expression otherwise it errors
  because the function declarations load before any code is executed and so the state 
  isn't set to be referenced. Function expressions load only when the interpreter reaches that line of code. 
   */

  // function prop for input toolbar, is hidden if user is offline
  renderInputToolbar = (props) => {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  // Creates a new component for the custom actions that works with the props that this function receives
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // function checks each message to see if it contains location data.
  //If the answer is yes, it will return a MapView
  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  render() {
    // Set title as user's name
    this.props.navigation.setOptions({ title: this.props.route.params.name });

    return (
      // Make sure to set View container to flex 1 so it covers full screen
      <View style={{ flex: 1 }}>
        {/* <Button onPress={() => this.deleteMessages()}>Wipe messages</Button> */}
        <GiftedChat
          // Gifted Chat component
          messagesContainerStyle={{
            backgroundColor: this.props.route.params.color,
          }}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderCustomView={this.renderCustomView}
          renderSystemMessage={this.renderSystemMessage}
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />

        {
          // Library is used to avoid Android keyboard from covering input /
          // if no Android this isn't used
          // Platform.OS === 'android' ? <KeyboardSpacer /> : null
        }
      </View>
    );
  }
}

export default Chat;
