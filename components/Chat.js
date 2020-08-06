import React from 'react';
import { View, Text, Platform } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }
  // Mount component with initial state including welcome message from system and user
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 3,
          text: 'Welcome to the chat, ' + this.props.route.params.name,
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }
  // Function to append new message to the state "messages" in the component
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
    // Decouple proprs
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    let { chosenColor } = this.props.route.params.color;

    return (
      // Make sure to set View container to flex 1 so it covers full screen
      <View style={{ flex: 1 }}>
        <GiftedChat
          // Gifted Chat component
          messagesContainerStyle={{
            backgroundColor: this.props.route.params.color,
          }}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />

        {
          // Library is used to avoid Android keyboard from covering input /
          // if no Android this isn't used
          Platform.OS === 'android' ? <KeyboardSpacer /> : null
        }
      </View>
    );
  }
}
