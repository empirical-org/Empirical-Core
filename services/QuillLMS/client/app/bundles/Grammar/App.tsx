import * as React from "react";
import { QueryClientProvider } from 'react-query';
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import { route } from "./routes";
import { configureStore, initStore } from "./store/configStore";

import { DefaultReactQueryClient } from "../Shared";

const store = configureStore();
store.dispatch(initStore());
const queryClient = new DefaultReactQueryClient();

class App extends React.Component<{}, {}> {
  componentDidMount() {
    document.title = 'Quill Grammar'
  }

  public render(): JSX.Element {
    return (
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <Provider store={store}>
          <HashRouter basename="/">{route}</HashRouter>
        </Provider>
      </QueryClientProvider>
    );
  }
}

export default App;
