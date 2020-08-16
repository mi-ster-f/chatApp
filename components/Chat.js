import React from 'react';
import { View, Text, Platform } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { v4 as uuidv4 } from 'uuid';

// Dealing with yellow banner timeout issue with react-native sdk
// https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes
import { YellowBox } from 'react-native';

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
      messages: [],
      uid: '',
      loggedIntext: 'Please wait.. Logging in..',
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      systemMessage: [],
    };

    YellowBox.ignoreWarnings(['Setting a timer']);

    // create a constructor that will initialize the Firestore app and add the config inside it
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // creating a references to messages collection in Firestore db
    this.referenceMessages = firebase.firestore().collection('messages_new');
  }

  // Mount component with initial state including welcome message from system and user
  componentDidMount() {
    //Authorise users anonymously and listen for auth change events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          await firebase.auth().signInAnonymously();
        } catch (err) {
          console.log(err);
        }
      }
      // this.addSystemMessage();

      //load messages from asyncStorage
      this.getMessages();
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: '',
        user: {
          _id: user.uid,
          name: this.props.route.params.name,
          avatar: '',
        },
        messages: [
          {
            _id: uuidv4(),
            text: this.props.route.params.name + ' has entered the chat',
            createdAt: new Date(),
            system: true,
          },
        ],
      });
      /*
        The onSnapshot method returns an unsubscribe function so all we need to do is save that reference
       and call the function when the component is unmounted.
       */
      // listen for collection changes for current user
      this.unsubscribeMessages = this.referenceMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // // stop listening for changes
    this.unsubscribeMessages();
  }

  // function to get messages from asyncStorage and set as messages state
  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // method that writes chat messages to state messages when onSnapshot() gets fired i.e when collection changes
  onCollectionUpdate = (querySnapshot) => {
    console.log('this is the user obj ' + this.state.user._id);
    console.log('this is the user obj ' + this.state.user.name);
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || '',
        },
        uid: data.uid,
      });
    });
    this.setState({
      messages,
    });
  };

  // Add/save a message to Firestore
  addMessage() {
    let message = this.state.messages;
    console.log(message);
    this.referenceMessages.add({
      _id: message[0]._id,
      text: message[0].text,
      createdAt: message[0].createdAt,
      user: {
        _id: this.state.user._id,
        name: this.props.route.params.name,
        avatar: this.state.user.avatar,
      },
      uid: this.state.uid,
    });
  }

  // Add system message function for when user joins chat
  // addSystemMessage() {
  //   // Creating random uuid string to mirror uuid generated by Giftedchat
  //   const randomUuid = uuidv4();
  //   const systemMessage = {
  //     _id: randomUuid,
  //     text: this.props.route.params.name + ' has entered the chat',
  //     createdAt: new Date(),
  //     system: true,
  //   };
  //   this.setState(
  //     (previousState) => ({
  //       messages: GiftedChat.append(previousState.messages, systemMessage),
  //     }),
  //     () => {
  //       // Add message to database
  //       this.addMessage();
  //     }
  //   );
  // }

  // Function to append new message to the state "messages" in the component
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // Add message to database
        this.addMessage();
      }
    );
  }

  // function prop for GiftedChat to customise the chat bubble
  renderBubble(props) {
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
  }

  // function prop for styling of system message in messages state
  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        // containerStyle={{ backgroundColor: 'pink' }}
        // wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
        textStyle={{ color: '#fff', fontWeight: '900' }}
      />
    );
  }

  render() {
    // Decouple props
    let { name } = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    let { chosenColor } = this.props.route.params.color;

    return (
      // Make sure to set View container to flex 1 so it covers full screen
      <View style={{ flex: 1 }}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          // Gifted Chat component
          messagesContainerStyle={{
            backgroundColor: this.props.route.params.color,
          }}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
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
