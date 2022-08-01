import * as React from "react";
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import { QueryClientProvider } from 'react-query'

import {route} from "./routes";
import { configureStore, initStore } from "./store/configStore";
import { DefaultReactQueryClient } from '../Shared';

const store = configureStore();
store.dispatch(initStore());
const queryClient = new DefaultReactQueryClient();

class App extends React.Component<{user: string}, {}> {
  public render(): JSX.Element {
    const { user } = this.props;
    return (
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <Provider store={store}>
          <HashRouter basename="/">{route(user)}</HashRouter>
        </Provider>
      </QueryClientProvider>
    );
  }
}

export default App;
