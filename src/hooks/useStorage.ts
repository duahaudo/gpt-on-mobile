import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStorage = (key: string) => {
  const [value, setValueFn] = useState<any>();

  const setValue = useCallback(
    (newValue: object) => {
      AsyncStorage.setItem(key, JSON.stringify(newValue));
    },
    [key],
  );

  useEffect(() => {
    if (key) {
      AsyncStorage.getItem(key).then(_value => {
        if (_value) {
          setValueFn(JSON.parse(_value) || _value);
        } else {
          setValueFn(null);
        }
      });
    }
  }, [key]);

  return {
    value,
    setValue,
  };
};

export default useStorage;
