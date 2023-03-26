import * as React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { route } from "./routes";
import { configureStore, initStore } from "./store/configStore";

const store = configureStore();
store.dispatch(initStore());

class App extends React.Component<{}, {}> {
  componentDidMount() {
    document.title = 'Quill Proofreader'
  }

  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <HashRouter basename="/">{route}</HashRouter>
      </Provider>
    );
  }
}

export default App;
