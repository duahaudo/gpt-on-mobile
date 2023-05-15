import {Dispatch} from 'react';

export enum ACTION {
  'SET_API_KEY' = 'SET_API_KEY',
}

export interface PayLoad {
  payload: unknown;
  type: ACTION;
}

export interface State {
  apiKey: string;
}

export interface AppContext {
  state?: State;
  dispatch?: Dispatch<PayLoad>;
}
