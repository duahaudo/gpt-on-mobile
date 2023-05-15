import React, {useCallback, useContext, useState} from 'react';
import {
  Button,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import useStorage from '../hooks/useStorage';
import {appContext} from '../reducer';
import {ACTION} from '../reducer/interface';
import {styles} from './style';

const ApiModal: React.FC = () => {
  const [text, setText] = useState('');
  const {dispatch} = useContext(appContext);
  const {setValue} = useStorage('apiKey');

  const onSaveHandler = useCallback(() => {
    console.log('button clicked', text);
    if (dispatch && text) {
      dispatch({
        type: ACTION.SET_API_KEY,
        payload: text,
      });

      setValue({api: text});
    }
  }, [dispatch, text, setValue]);

  return (
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Enter api here"
        />
        <TouchableOpacity onPress={() => onSaveHandler()}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApiModal;
