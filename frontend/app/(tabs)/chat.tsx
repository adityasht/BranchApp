import { StyleSheet, Image, Platform,TextInput, ScrollView, Text,View, TouchableOpacity, Pressable, Button} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {base_url} from '@/constants/apiRoute'

export default function Chat() {
  const [inChat, setInChat] = useState(false)
  const [receiver, setReceiver] = useState("")
  const [message, setMessage] = useState("")
  const [allMessages, setAllMessages] = useState(Array)

  const user1 = 1
  const user2 = 2

  const users = [{name: 'john_doe', pic: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    interests: ['Music', 'Gaming', 'Hiking', 'Thinking', 'Japanese']
  },
  {name: 'Tony', pic: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    interests: ['Guitar', 'Gaming', 'Jerking']
  },
  {name: 'Darius', pic: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    interests: ['Music', 'Gaming', 'Squashing']
  }]

  const goToChat = (getReceiver:string) => {
    setReceiver(getReceiver)
    console.log(receiver)
    setInChat(true)
  }

  useEffect(() => {
    if (inChat) {
      getConversation()
    }
  }, [inChat])
  
  const handleSend = async () => {
    await sendMessage()
    getConversation()
    setMessage("")
  }

  const sendMessage = async () => {
    try {
      const send_message = {
        message: message,
        sender_id: user1,
        receiver_id: user2
      }

      const response = await fetch(base_url + '/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': base_url
        },
        body: JSON.stringify(send_message),
      });

      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      console.log('Data from Flask:', data.conversation);
      return true;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  const getConversation = async () => {
    try {
      const response = await fetch(base_url + '/view_conversation/' + user1 + '/' + user2, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': base_url
        },
      });

      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      console.log('Data from Flask:', data.conversation);
      setAllMessages(data.conversation)
      return true;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  return (
    <>
      {!inChat &&
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>Chat</Text>
          </View>
          <View style={styles.userAllContainer}>
            {users.map((user, index) => (
              <View style={styles.chatContainer}>
                <View style={styles.lineContainer}>
                  <View style={styles.line} />
                </View>
                <Pressable onPress={() => goToChat(user.name)} style={styles.userContainer}>
                  <View style={styles.photoContaienr}>
                    <Image
                      source={{uri: user.pic}}
                      style={styles.picture}
                    ></Image>
                    <Text style={styles.userText}>{user.name}</Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      }
      {inChat &&
        <>
          <ScrollView contentContainerStyle={styles.messageContainer}>
          <Pressable onPress={() => {setInChat(false)}}>
            <Text style={styles.receiverText}>{"< " + receiver}</Text>
          </Pressable>
          {allMessages.map((message, index) => (
            <View style={styles.allMessageContainer}>
              <View
                style={[
                  styles.messageSubContainer,
                  message.SenderID === user1 ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.Message}</Text>
              </View>
            </View>
          ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              style={styles.textInput}
            />
            <Button title="Send" onPress={handleSend}/>
          </View>

        </>
      }
    </>

  );
}

const styles = StyleSheet.create({
  allMessageContainer: {
    // flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  messageSubContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '120%',
  },
  myMessage: {
    backgroundColor: '#DCF8C6', // Light green for your messages
    alignSelf: 'flex-end', // Aligns to the right
  },
  otherMessage: {
    backgroundColor: '#EAEAEA', // Light gray for others' messages
    alignSelf: 'flex-start', // Aligns to the left
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  chatContainer: {
  },
  photoContaienr: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems:'center'
  },
  messageContainer: {
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
    height: "100%",
    overflow: 'scroll'
  },
  userText: {
    marginLeft: 10,
    fontSize: 20,
  },
  receiverText: {
    marginLeft: 20,
    fontSize: 20,
  },
  picture: {
    width: 40,
    height: 40,
    borderRadius: 100, 
    marginLeft: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  userAllContainer: {
    width: "100%"
  },
  textContainer: {
    alignItems: 'center'
  },
  mainText: {
    fontSize: 20,
    alignItems: 'center',
    fontWeight: 'bold'
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: "50%"
  },
  pill: {
    backgroundColor: '#008000', // Pill background color
    borderRadius: 20,          // Make it pill-shaped
    paddingVertical: 5,       // Vertical padding
    paddingHorizontal: 5,     // Horizontal padding
    margin: 5,                 // Space between pills
    alignItems: 'center'
  },
  pillText: {
    color: 'white',            // Text color
    fontWeight: 'bold',        // Bold text
    fontSize: 10
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#808080', // Color of the line
  },
  lineText: {
    // marginHorizontal: 10,
    fontSize: 12, // Small text size
    color: '#808080', // Text color
  },
});
