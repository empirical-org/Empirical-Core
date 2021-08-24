import * as React from "react";
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";

import {route} from "./routes";
import { configureStore, initStore } from "./store/configStore";

const store = configureStore();
store.dispatch(initStore());

class App extends React.Component<{user: string}, {}> {
  public render(): JSX.Element {
    const { user } = this.props;
    return (
      <Provider store={store}>
        <HashRouter basename="/">{route(user)}</HashRouter>
      </Provider>
    );
  }
}

export default App;
