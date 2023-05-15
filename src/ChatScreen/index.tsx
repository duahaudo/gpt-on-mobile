import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GiftedChat, IMessage, User} from 'react-native-gifted-chat';
import {useChatGpt} from '../hooks/useGpt';
import CustomStatusBar from '../StatusBar';

const BOT_USER: User = {
  _id: 2,
  name: 'Chat GPT',
  avatar: require('../images/assistance.jpeg'),
};

const CURRENT_USER: User = {
  _id: 1,
  name: 'Question',
  avatar: require('../images/question.png'),
};

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const [question, setQuestion] = useState<string>('Hi');
  const {answer, newChat, isReady, loading, tokens} = useChatGpt(question);

  const handleSend = (newMessages: IMessage[]) => {
    const content = newMessages[newMessages.length - 1].text;
    if (content.toLowerCase() !== 'new') {
      setQuestion(content);
      // Send message to server
      // socket.emit('message', newMessages[0].text);
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessages),
      );
    } else {
      setMessages([]);
      newChat();
      setQuestion('Hi');
    }
  };

  const handleReceiveMessage = useCallback(
    (text: string) => {
      const newMessage: IMessage = {
        _id: messages.length + 1,
        text,
        createdAt: new Date(),
        user: BOT_USER,
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [newMessage]),
      );
    },
    [messages.length],
  );

  useEffect(() => {
    handleReceiveMessage(answer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  return (
    <View style={styles.container}>
      {/* {tokens && <Text></Text>}
      {loading && <Text>Loading ...</Text>} */}
      <CustomStatusBar tokens={tokens} loading={loading} />
      {isReady && (
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={CURRENT_USER}
          alwaysShowSend
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 100,
    borderTopWidth: 1,
  },
});

export default ChatScreen;
