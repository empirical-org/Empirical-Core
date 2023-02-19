import { createStore, applyMiddleware, Dispatch, Action } from "redux";
import {composeWithDevTools} from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import { initStoreAction } from "../actions/actions";
import { rootReducer } from "../reducers/rootReducer";

export interface IState {
}

export const initStore = () => {
  return (dispatch: Dispatch<Action<any>>) => {
    const initialState = {
    }
    return dispatch(initStoreAction(initialState));
  };
};

export const configureStore = () => {
  if (import.meta.env.NODE_ENV === "production") {
    return createStore(
      rootReducer,
      applyMiddleware(thunk),
    );
  } else {
    return createStore(
      rootReducer,
      composeWithDevTools(
        applyMiddleware(thunk),
      ),
    );
  }
};
