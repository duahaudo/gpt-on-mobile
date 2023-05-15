import {useReducer} from 'react';
import {appContext, initializeState, reducer} from '.';

const Provider = ({children}: {children: JSX.Element}) => {
  const [state, dispatch] = useReducer(reducer, initializeState);

  return (
    <appContext.Provider value={{state, dispatch}}>
      {children}
    </appContext.Provider>
  );
};

export default Provider;
