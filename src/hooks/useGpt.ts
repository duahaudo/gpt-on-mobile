import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import axios, {AxiosInstance} from 'axios';
import {appContext} from '../reducer';

interface Message {
  role: string;
  content: string;
}
const createMessage = (msg: string) => ({role: 'user', content: msg});

const getContentFromResponse = (response: any) => {
  if (response?.data?.error) {
    const {message, type} = response?.data?.error;
    return {
      content: `${type} - ${message}`,
      role: 'system',
      usage: {},
    };
  }
  const {choices, usage} = response as any;
  const {content, role} = (choices as any)[0].message;
  return {content, role, usage};
};

const createConversation = (instance: AxiosInstance) => {
  const history: any[] = [];

  return async (message?: string) => {
    if (!message) {
      return history.map(item => item.content);
    }
    history.push(createMessage(message));
    try {
      const response = await askChatGPT(instance, [...history]);
      history.push(getContentFromResponse(response));

      return response;
    } catch (error) {
      history.pop();
      return error;
    }
  };
};

const askChatGPT = async (instance: AxiosInstance, messages: Message[]) => {
  return new Promise(async (resolve, reject) => {
    try {
      const request = {
        model: 'gpt-3.5-turbo',
        stream: false,
        messages,
      };
      console.log(
        `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ returnnewPromise ➡ request.message:`,
        messages,
      );

      const {data} = await instance.post('chat/completions', request);
      console.log(
        `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ askChatGPT ➡ data:`,
        data,
      );

      resolve(data);
    } catch (error: any) {
      if (error.response) {
        console.log('error.response', error.response.status);
        console.log('error.response', error.response.data);
        reject(error.response);
      } else {
        console.log('error.message', error.message);
      }
    }
  });
};

export const useChatGpt = (question: string) => {
  const [answer, setAnswer] = useState<string>('');
  const {state} = useContext(appContext);

  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(null);

  const instance = useMemo(() => {
    if (!state?.apiKey) {
      return null;
    }
    return axios.create({
      baseURL: 'https://api.openai.com/v1/',
      headers: {
        Authorization: `Bearer ${state?.apiKey}`,
      },
    });
  }, [state]);

  const conversationRef = useRef<any>(null);
  const newChat = useCallback(() => {
    if (instance) {
      conversationRef.current = createConversation(instance);
      setIsReady(true);
    }
  }, [instance]);

  useEffect(() => {
    if (!conversationRef.current && !!instance) {
      newChat();
    }
  }, [instance, conversationRef, newChat]);

  useEffect(() => {
    if (question && isReady) {
      setLoading(true);
      const conversationFn = conversationRef.current;
      conversationFn(question).then((response: any) => {
        const {content, usage} = getContentFromResponse(response);
        const {total_tokens} = usage;

        setAnswer(content);
        setLoading(false);
        setTokens(total_tokens);

        if (!total_tokens || total_tokens >= 4200) {
          newChat();
        }
      });
    }
  }, [question, isReady, newChat]);

  return {answer, newChat, isReady, loading, tokens};
};
