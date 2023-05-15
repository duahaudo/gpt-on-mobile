import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  AsyncStorage,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ChatScreen from './ChatScreen';
import Provider from './reducer/appProvider';
import {useContext, useEffect, useState} from 'react';
import useStorage from './hooks/useStorage';
import {appContext} from './reducer';
import {ACTION} from './reducer/interface';
import ApiModal from './GetApiModal';

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const {value} = useStorage('apiKey');
  const {state, dispatch} = useContext(appContext);

  useEffect(() => {
    if (value?.api && dispatch && !state?.apiKey) {
      dispatch({
        type: ACTION.SET_API_KEY,
        payload: value?.api,
      });
    }
  }, [value, dispatch, state]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ChatScreen />
      {!state?.apiKey && <ApiModal />}
    </SafeAreaView>
  );
};

const Main = () => {
  return (
    <Provider>
      <Home />
    </Provider>
  );
};

export default Main;
