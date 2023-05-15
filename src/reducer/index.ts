import {createContext} from 'react';
import {ACTION, AppContext, PayLoad, State} from './interface';

export const initializeState: State = {
  apiKey: '',
};

const reducerExecute = (state: State, action: PayLoad) => {
  switch (action.type) {
    case ACTION.SET_API_KEY: {
      const apiKey = action.payload as string;
      // const apiKey = (await AsyncStorage.getItem('apiKey')) as string;
      return {apiKey};
    }
  }

  return state;
};

export const reducer = (state: State, action: PayLoad) => {
  // console.log(
  //   `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ oldState:`,
  //   state,
  // );
  // console.log(
  //   `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ action:`,
  //   action,
  // );
  const newState = reducerExecute(state, action);
  // console.log(
  //   `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ newState:`,
  //   newState,
  // );

  return newState;
};

export const appContext = createContext<AppContext>({
  state: initializeState,
});
